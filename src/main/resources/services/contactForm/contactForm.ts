import { Request, Response } from 'enonic-types/controller'
import { EmailParams } from 'enonic-types/mail'
import { HttpRequestParams, HttpResponse } from 'enonic-types/http'
const {
  request
} = __non_webpack_require__('/lib/http-client')
const {
  send
} = __non_webpack_require__('/lib/xp/mail')

exports.post = (req: Request): Response => {
  const formData: ContactFormData = JSON.parse(req.body)

  log.info('\n\n## data\n--------------\n%s\n', JSON.stringify(formData, null, 4))

  const secret: string | null = app.config && app.config['RECAPTCHA_SECRET_KEY'] ? app.config['RECAPTCHA_SECRET_KEY'] : null
  if (secret) {
    const requestParams: HttpRequestParams = {
      url: ' https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      queryParams: {
        secret,
        response: formData.token
      }
    }
    const response: HttpResponse = request(requestParams)
    const recaptchaInfo: RecaptchaResponse | null = response.body ? JSON.parse(response.body) : null

    if (recaptchaInfo && recaptchaInfo.success && recaptchaInfo.score > 0.5 && recaptchaInfo.action === 'submitContactForm') {
      return postMail(formData)
    }
  }

  return {
    status: 400,
    contentType: 'application/json',
    body: {
      success: false,
      message: 'Henvendelsen din ble desverre ikke godkjent, prøv igjen'
    }
  }
}

interface ContactFormData {
  token: string;
  email: string;
  name: string;
  text: string;
  receiver: {
    id: string;
    title: string;
  };
}

interface RecaptchaResponse {
  success: boolean;
  // eslint-disable-next-line camelcase
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
}

function postMail(formData: ContactFormData): Response {
  const emailParams: EmailParams = {
    from: 'noreply@ssb.no',
    to: getReceiverEmail(formData.receiver.id),
    subject: 'Forespørsel SSB - ' + formData.receiver.title,
    body: formData.text
  }

  log.info('SEND MAIL: ' + JSON.stringify(emailParams, null, 4))

  const isSent: boolean = send(emailParams)

  if (isSent) {
    return {
      status: 200,
      contentType: 'application/json',
      body: {
        success: true,
        message: 'Skjemaet ble sendt'
      }
    }
  } else {
    return {
      status: 400,
      contentType: 'application/json',
      body: {
        success: false,
        message: 'Kunne ikke sende mail'
      }
    }
  }
}

function getReceiverEmail(receiver: string): string {
  switch (receiver) {
  case 'generell':
    return app.config && app.config['ssb.contactform.tomail.generell'] ? app.config['ssb.contactform.tomail.generell'] : 'ssbno_teknisk@ssb.no'
  case 'statistikk':
    return app.config && app.config['ssb.contactform.tomail.statistikk'] ? app.config['ssb.contactform.tomail.statistikk'] : 'ssbno_teknisk@ssb.no'
  case 'innrapportering':
    return app.config && app.config['ssb.contactform.tomail.innrapportering'] ? app.config['ssb.contactform.tomail.innrapportering'] : 'ssbno_teknisk@ssb.no'
  default:
    return app.config && app.config['ssb.contactform.tomail.generell'] ? app.config['ssb.contactform.tomail.generell'] : 'ssbno_teknisk@ssb.no'
  }
}
