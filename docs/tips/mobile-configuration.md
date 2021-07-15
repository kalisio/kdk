# Mobile configuration

## IOs

### Renew iOS Push Certificates

Because the **KDK** relies on [SNS](https://aws.amazon.com/sns/?nc1=h_ls&whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc) to manage mobile push notifications, you must:

1. Create a new iOS push certificate

 - Go to  [https://developer.apple.com/](https://developer.apple.com/)
 - Click **Certificates, Identifiers & Profiles**
 - Click **+** on the right of the **Certificates** label
 - Under Production section, select **Apple Push Notification service SSL (Sandbox & Production)** and click **Continue** 
 - Select the AppId (build Identifier of iOS application) and click **Continue** 
 - Upload you CSR file or create a new one if needed and click **Continue** 
 - Download the created certificate 

2. Obtain app private key (.p12 File) for **SNS**

 - Open **Keychain access** by double clicking the create certificate in the previous step
 - Select the certificcate and export it 
 - Accept the default **.p12** file format, provide a password and then click **Save**.

3. Update your SNS Application plarform

 - Go to https://console.aws.amazon.com/sns/
 - Click the corresponding application platform and click **Modify**
 - Under certificate type, select **iOS push certificate**
 - Under certificate, click to upload the created private key (.p12 file)
 - Under password, enter the password you assigned to the p12 file when exporting it
 - Click **Load Credentials form file**
 - Click **Save changes**

 ::: tip
The following procedure must be performed for each flavor
 :::
