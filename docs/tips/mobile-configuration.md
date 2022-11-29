# Mobile configuration

## IOs

### Renew iOS Push Certificates

Because the **KDK** relies on [SNS](https://aws.amazon.com/sns/?nc1=h_ls&whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc) to manage mobile push notifications, you must:

1. Create a new iOS push certificate

 - Go to  [https://developer.apple.com/](https://developer.apple.com/)
 - Click **Certificates, Identifiers & Profiles**
 - Click **+** on the right side of the **Certificates** label
 - Under Production section, select **Apple Push Notification service SSL (Sandbox & Production)** and click **Continue** 
 - Select the AppId (build Identifier of iOS application) and click **Continue** 
 - Upload you CSR file or create a new one if needed and click **Continue** 
 - Download the created certificate 

2. Obtain the app private key (.p12 File) for SNS

 - Open **Keychain access** by double clicking the create certificate in the previous step
 - Select the certificcate and export it 
 - Accept the default **.p12** file format, provide a password and then click **Save**.

3. Update your SNS Application platform

 - Go to [https://console.aws.amazon.com/sns/](https://console.aws.amazon.com/sns/)
 - Click the corresponding application platform and click **Modify**
 - Under certificate type, select **iOS push certificate**
 - Under certificate, click to upload the created private key (.p12 file)
 - Under password, enter the password you assigned to the p12 file when exporting it
 - Click **Load Credentials form file**
 - Click **Save changes**

::: tip
The following procedure must be performed for each flavor: `dev`, `test` and `prod`.
:::

### Debug provisioning profile

In order to debug a cordova application you will need to use a develoment provisiong profile due to some [restrictions](https://webkit.org/web-inspector/enabling-web-inspector/). You can do this directly through your Apple Developer account but you will need a Certificate Signing Request first. To generate it you can use `openssl`:
```
openssl genrsa -out ios-dev.key 2048
openssl req -new -key ios-dev.key -out ios-dev.csr
```

Use the following properties to generate the signing request:
* C = Your country code e.g. FR
* O = Entity name of your Apple Developer account e.g. KALISIO
* OU = Team ID of your Apple Developer account e.g. V456HYJKLI
* CN = Account Holder of your Apple Developer account e.g John Doe
* Email Address = Email Address of your Apple Developer account

Then create an iOS development certificate with your Apple Developer account and use the generated CSR.

If you'd like to check the content of a provisioning profile here is the command to extract the plist file from it: `openssl smime -inform der -verify -noverify -in file.mobileprovision`

### Certificates tips

If you need to create a PKCS12 file from a certificate you first need to convert it to PEM format:
```
openssl x509 -inform der -in ios-dev.cer -out ios-dev.pem
openssl pkcs12 -export -out ios-dev.p12 -inkey ios-dev.key -in ios-dev.pem -passin pass:password -passout pass:password
```

If you'd like to view the content of a certificate:
```
openssl x509 -in ios-dev.cer -inform der -text
// p12 file
openssl pkcs12 -in ios-dev.p12 -nodes -passin pass:password | openssl x509 -noout -subject
```
