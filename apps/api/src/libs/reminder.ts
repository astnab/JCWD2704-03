import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { transporter } from './nodemailer';
import moment, { locales } from 'moment-timezone';
const prisma = new PrismaClient();

// Function to send reminder emails
export default async function sendBookingReminders(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        status: 'awaiting_confirmation',
      },
      include: {
        user: true,
        property: true,
      },
    });
    var cron = require('node-cron');
    let targetDate = new Date();
    if (order) {
      targetDate = new Date(order?.checkIn_date);
    }
    console.log(order?.checkIn_date);
    function getCronExpression(date: Date) {
      const second = 10;
      const minute = 59;
      const hours = 23;
      const dayOfMonth = date.getUTCDate() - 1;
      const month = date.getUTCMonth() + 1;
      return `${second} ${minute} ${hours} ${dayOfMonth} ${month} *`;
    }
    console.log(getCronExpression(targetDate));

    const task = cron.schedule(
      getCronExpression(targetDate),
      () => {
        console.log('masuk function');
        const krimEmail = transporter.sendMail({
          from: 'purwadhika2704@gmail.com',
          to: order?.user.email,
          subject: 'Booking Reminder',
          html: '<h1> iniii reminder buat checkIn () <h1/>',
        });
        console.log('kiiriim email', krimEmail);

        task.stop();
      },
      {
        scheduled: true,
        timezone: 'Asia/Jakarta',
      },
    );
  } catch (error) {
    console.error('Error retrieving orders:', error);
  }
}