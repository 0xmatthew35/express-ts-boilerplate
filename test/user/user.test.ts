import { TestSuite } from "../conftest";
import { testCasesGet, testCasesGetWithMock, testCasesPost, testCasesPostWithMock } from "./testcase";


new TestSuite('get user: example')
    .parametrize(testCasesGet)
    .get()
    .assert()
    .build()

new TestSuite('get user: mock')
    .parametrize(testCasesGetWithMock)
    .get()
    .assert()
    .build()

new TestSuite('post user: 500')
    .parametrize(testCasesPost)
    .post()
    .assert()
    .build()

new TestSuite('post user: mock')
    .parametrize(testCasesPostWithMock)
    .post()
    .assert()
    .build()