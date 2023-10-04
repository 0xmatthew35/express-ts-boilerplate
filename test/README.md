# API TESTING

## Cách viết test:
```
new TestSuite(<TESTSUITE_DESCRIPTION>)
    .parametrize(<TESTCASES>)
    .auth()
    .post()
    .assert()
    .build()
```

Trong đó:
- TESTSUITE_DESCRIPTION: mô tả thông tin testsuite
- TESTCASES: danh sách testcases, cấu trúc của testcase:
    ```
    TestCase = {
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
    }
    ```
- parametrize: hàm thực hiện tạo các test instance
- auth: hàm thực hiện login cho testsuite cần auth
- post: hàm thực hiện call lên server (get/post/put/patch/delete)
- assert: hàm thực hiện so sánh response với expected response của testcase
- build: hàm thực hiện chạy testsuite

## Cách chạy test:

```
    npm run test
```

## Chú ý:

- Các test viết dưới folder test với đuôi .test.ts
- Test những API cần đăng nhập phải có .auth()
- Thông tin đăng nhập được cấu hình qua export biến môi trường trong terminal qua câu lệnh:
    ```
        export username=''
        export password=''
    ```

## Tài khoản test:

- username: 
- password: 