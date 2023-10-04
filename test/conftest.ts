import request from 'supertest';

import Server from '../src/server';
import { mysqlDataSource } from '../src/database/MyDataSource';

const versionPrefix = '/api/v1'

export type TestCase = {
    description: string;
    path: string; // Endpoint path
    body?: any; // Request body (optional)
    expectedResponse: {
        status: number; // Expected HTTP status code
        body?: any; // Expected response data (optional)
    };
    mocks?: {
        module: any; // Module or class
        function: any; // Target mock function
        returnFunction: any; // Return value in function
        instance?: any // Mock instance (no use by client)
        assert?: {
            callCount: number;
            params?: any[][];
        } // Test behavior
    }[]
};

/**
 * Recursively compares the expected and actual data, checking both types and values.
 * @param {any} expected - The expected data structure.
 * @param {any} data - The actual data to compare against.
 * @throws {Error} - Throws an error if the data does not match the expected structure or values.
 */
function assertRecursive(expected: any, data: any) {
    try {
        // Check primitive data types
        if (typeof expected !== typeof data) {
            throw new Error(`Type of data is ${typeof data}, which does not match the expected type ${typeof expected}`);
        }
    
        // Check specific data types
        if (Array.isArray(expected)) {
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array as expected.');
            }
    
            if (expected.length !== data.length) {
                throw new Error(`Length of data does not match the length of the expected array. Expected '${expected.length}', got '${data.length}'.`);
            }
    
            for (let i = 0; i < expected.length; i++) {
                assertRecursive(expected[i], data[i]);
            }
        } else if (typeof expected === 'object' && expected !== null) {
            if (typeof data !== 'object' || data === null) {
                throw new Error('Data is not an object as expected.');
            }
    
            // Check for dictionary-like objects (objects)
            for (const key of Object.keys(expected)) {
                if (!data.hasOwnProperty(key)) {
                    throw new Error(`Key '${key}' not found in data.`);
                }
                for (const key of Object.keys(expected)) {
                    assertRecursive(expected[key], data[key]);
                }
            }
        } else {
            if (expected !== data) {
                throw new Error(`Miss match`);
            }
        }
    } catch(ex) {
        throw new Error(
            `${(ex as Error).message}\nData does not match the expected value. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(data)}.`
        )
    }
}

let server: Server

// Set up the server before running tests
beforeAll(async () => {
    console.log('\x1b[34m Start server \x1b[0m');
    server = new Server();
    await server.initialize()
})

// Clean up resources after all tests
afterAll(async () => {
    console.log('\x1b[34m Stop server \x1b[0m');
    await mysqlDataSource.destroy()
});

class TestInstance {
    private testCase: TestCase
    private response: any = null
    public actions: (keyof TestInstance)[] = []

    constructor(testCase: TestCase) {
        this.testCase = testCase
    }

    private setUp(): void {
        console.log('\x1b[1m\x1b[33m' + this.testCase.description + '\x1b[0m');
        // Reset mock first
        console.log('Clean up');
        jest.restoreAllMocks();

        // Mock after
        console.log('Mock');
        for (let mock of this.testCase.mocks || []) {
            mock.instance = jest.spyOn(mock.module, mock.function)
            mock.instance.mockImplementation(mock.returnFunction)
        }
    }

    public async get(): Promise<void> {
        // Perform a GET request and store the response
        this.response = await request(server.app).get(`${versionPrefix}${this.testCase.path}`);
    }

    public async post(): Promise<void> {
        // Perform a POST request and store the response
        this.response = await request(server.app).post(`${versionPrefix}${this.testCase.path}`).send(this.testCase.body);
    }

    public async put(): Promise<void> {
        // Perform a PUT request and store the response
        this.response = await request(server.app).put(`${versionPrefix}${this.testCase.path}`).send(this.testCase.body);
    }

    public async patch(): Promise<void> {
        // Perform a PATCH request and store the response
        this.response = await request(server.app).patch(`${versionPrefix}${this.testCase.path}`).send(this.testCase.body);
    }

    public async delete(): Promise<void> {
        // Perform a DELETE request and store the response
        this.response = await request(server.app).delete(`${versionPrefix}${this.testCase.path}`);
    }

    public assert(): void {
        // Assert that the response status code and body match the expected values
        expect(this.response.status).toBe(this.testCase.expectedResponse.status);
        if (this.testCase.expectedResponse.body) {
            assertRecursive(this.testCase.expectedResponse.body, this.response.body)
        }
    }

    public build(): void {
        // Build a Jest test case with the defined actions
        it(this.testCase.description, async () => {
            this.setUp()

            // Do test
            for (const action of this.actions) {
                switch (action) {
                    case 'get': {
                        await this.get()
                        break;
                    }
                    case 'post': {
                        await this.post()
                        break;
                    }
                    case 'put': {
                        await this.put()
                        break;
                    }
                    case 'patch': {
                        await this.patch()
                        break;
                    }
                    case 'delete': {
                        await this.delete()
                        break;
                    }
                    case 'assert': {
                        this.assert()
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }

            // Assert behavior
            for (const mock of this.testCase.mocks || []) {
                if (mock.assert?.callCount) {
                    // Assert called count
                    expect(mock.instance.mock.calls.length).toBe(mock.assert.callCount);
                    if (mock.assert.params) {
                        for(let i = 0; i < mock.assert.callCount; i++) {
                            // Assert called input params
                            expect(mock.instance.mock.calls[i]).toEqual(mock.assert.params[i]);
                        }
                    }
                }
            }
        });
    }
}

export class TestSuite {
    private testInstaces: TestInstance[] = []
    private description: string

    constructor(description: string) {
        this.description = description
    }

    public parametrize(testCases: TestCase[]): TestSuite {
        // Define the test cases and create corresponding test instances
        for (const testCase of testCases) {
            this.testInstaces.push(new TestInstance(testCase))
        }
        return this
    }

    public auth(): TestSuite {
        // Placeholder for authentication-related actions (if needed)
        return this
    }

    public get(): TestSuite {
        // Add 'get' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('get')
        }
        return this
    }

    public post(): TestSuite {
        // Add 'post' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('post')
        }
        return this
    }

    public put(): TestSuite {
        // Add 'put' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('put')
        }
        return this
    }

    public patch(): TestSuite {
        // Add 'patch' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('patch')
        }
        return this
    }

    public delete(): TestSuite {
        // Add 'delete' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('delete')
        }
        return this
    }

    public assert(): TestSuite {
        // Add 'assert' action to all test instances
        for (let testInstance of this.testInstaces) {
            testInstance.actions.push('assert')
        }
        return this
    }

    public build(): void {
        // Build and run the Jest test cases for all test instances
        describe(this.description, () => {
            for (let testInstance of this.testInstaces) {
                testInstance.build()
            }
        })
    }
}
