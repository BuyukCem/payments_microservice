import MailService from '@sendgrid/mail';
import {ApplicationError} from "../helpers/errors.helper";

MailService.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendResetPasswordToken = async (user) => {
    try {
        const link = `http://${process.env.HOST_FRONT_PROJECT}:${process.env.PORT_FRONT_PROJECT}/reset_password/${user.dataValues.resetToken}`
       console.log(link)
        const msg = {
            to: user.dataValues.email,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject: 'Password change request',
            text: `Hello ${user.dataValues.firstName}, we heard you lost your password. You can recover with this token link: ${link}`,
        };
        return await MailService.send(msg);
    } catch (error) {
        throw new Error(error.message)
    }
}
