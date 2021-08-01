/** test file for connect.ts */
import { buildHostAndPortString, buildCredentialString } from '../lib/connect';

describe("tests each of the functions responsible for building fragments of the URI Connection String", () => {

    test("assembly of host and port string fragment", () => {
        const params = {
            host: "ip.address.com",
            port: "8080"
        };
        const result = 'ip.address.com:8080';

        const hostAndPortString = buildHostAndPortString(params);
        expect(hostAndPortString).toBe(result);
    });

    test("assembly of credential string fragment", () => {
        const params = {
            isUriEncoded: true,
            userpass: {
                username: "myFunUsername",
                password: "password"
            }
        };
        const result = "myFunUsername:password@";

        const credentialsString = buildCredentialString(params);
        expect(credentialsString).toBe(result);
    });
});
