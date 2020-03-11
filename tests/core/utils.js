import _ from 'lodash'
import google from 'googleapis'
import { expect } from 'chai'
const gmail = google.gmail('v1')

export const createGmailClient = (gmailApiConfig) => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      gmailApiConfig.clientEmail,
      null,
      gmailApiConfig.privateKey,
      ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.readonly'], // an array of auth scopes
      gmailApiConfig.user
    )

    jwtClient.authorize((err, tokens) => {
      if (err) reject(err)
      else {
        // Helper function used to check if a given email has been retrieved in GMail inbox
        // Erase it after check
        jwtClient.checkEmail = function (user, fromValue, subjectValue, done) {
          gmail.users.messages.list({
            auth: jwtClient,
            userId: user.email
          }, (err, response) => {
            if (err) done(err)
            expect(response.messages).toExist()
            expect(response.messages.length > 0).beTrue()
            gmail.users.messages.get({
              auth: jwtClient,
              id: response.messages[0].id,
              userId: user.email
            }, (err, response) => {
              if (err) done(err)
              const message = response.payload
              expect(message).toExist()
              expect(message.headers).toExist()
              const from = _.find(message.headers, header => header.name === 'From')
              expect(from.value).to.equal(fromValue)
              const subject = _.find(message.headers, header => header.name === 'Subject')
              expect(subject.value).to.equal(subjectValue)
              // Remove message to not pollute the mailbox
              // or simply call done for debug
              // done()
              gmail.users.messages.delete({
                auth: jwtClient,
                id: response.id,
                userId: user.email
              }, (err, response) => {
                done(err, message)
              })
            })
          })
        }
        resolve(jwtClient)
      }
    })
  })
}
