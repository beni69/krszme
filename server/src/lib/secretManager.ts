import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

export async function getSecret(name: string) {
    const [version] = await client.accessSecretVersion({
        name,
    });

    const payload = version.payload?.data?.toString();

    return payload;
}
