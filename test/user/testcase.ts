import { TestCase } from "../conftest";
import { User } from '../../src/entities/User';
import { UserService } from "../../src/services/impl/UserService";


export const testCasesGet: TestCase[] = [
    {
        description: 'example',
        path: '/',
        expectedResponse: {
            status: 404,
            body: null
        },
    },
    {
        description: 'get user: not found',
        path: '/user/1',
        expectedResponse: {
            status: 200,
            body: null
        },
    },
]

export const testCasesGetWithMock: TestCase[] = [
    {
        description: 'get user: Cong Hoang Tran',
        path: '/user/1',
        expectedResponse: {
            status: 200,
            body: {
                id: 1,
                firstName: 'Cong Hoang',
                lastName: 'Tran',
                age: 22,
            }
        },
        mocks: [
            {
                module: UserService.prototype,
                function: 'findOneById',
                returnFunction: async () => {
                    const user: User = {
                        id: 1,
                        firstName: 'Cong Hoang',
                        lastName: 'Tran',
                        age: 22,
                    };
                    return Promise.resolve(user);
                },
                assert: {
                    callCount: 1,
                    params: [[1]]
                }
            },
        ]
    },
    {
        description: 'get user: Manh Truong Bui',
        path: '/user/1',
        expectedResponse: {
            status: 200,
            body: {
                id: 1,
                firstName: 'Manh Truong',
                lastName: 'Bui',
                age: 23,
            }
        },
        mocks: [
            {
                module: UserService.prototype,
                function: 'findOneById',
                returnFunction: async () => {
                    const user: User = {
                        id: 1,
                        firstName: 'Manh Truong',
                        lastName: 'Bui',
                        age: 23,
                    };
                    return Promise.resolve(user);
                }
            },
        ]
    },
]

export const testCasesPost: TestCase[] = [
    {
        description: 'api error',
        path: '/user',
        body: {
            id: 1,
            firstName: 'Manh Truong',
            lastName: 'Bui',
            age: 23,
        },
        expectedResponse: {
            status: 500,
            body: null
        },
    },
]

export const testCasesPostWithMock: TestCase[] = [
    {
        description: 'mock',
        path: '/user',
        body: {
            id: 1,
            firstName: 'Cong Hoang',
            lastName: 'Tran',
            age: 22,
        },
        expectedResponse: {
            status: 200,
            body: null
        },
        mocks: [
            {
                module: UserService.prototype,
                function: 'findOneById',
                returnFunction: async () => {
                    const user: User = {
                        id: 1,
                        firstName: 'Cong Hoang',
                        lastName: 'Tran',
                        age: 22,
                    };
                    return Promise.resolve(user);
                },
                assert: {
                    callCount: 1,
                    params: [[NaN]]
                }
            },
        ]
    },
]