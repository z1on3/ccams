'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Printer } from 'lucide-react';

const SuccessPage = () => {
  const [username, setusername] = useState<string | null>(null);

  const handlePrint = () => {
    if (!username) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const idCardHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Farmer Username</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
              .id-card {
                width: 3.375in;
                height: 2.125in;
                padding: 20px;
                border: 1px solid #000;
                margin: 20px auto;
                position: relative;
                background: white;
              }
              .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .header h1 {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
              }
              .header h2 {
                margin: 5px 0;
                font-size: 12px;
              }
              .content {
                text-align: center;
                font-size: 12px;
              }
              .farmer-id {
                font-size: 16px;
                font-weight: bold;
                margin: 10px 0;
              }
              .footer {
                position: absolute;
                bottom: 10px;
                left: 20px;
                right: 20px;
                text-align: center;
                font-size: 8px;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="header">
              
              <h2>Municipality of San Luis</h2>
            </div>
            <div class="content">
              <p>Your Farmer Username is:</p>
              <p class="farmer-id">${username}</p>
              <p>Please keep this ID for future reference.</p>
            </div>
            <div class="footer">
              This card is the property of the Municipality of San Luis. If found, please return to the Municipal Hall.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(idCardHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  useEffect(() => {
    // Get the farmer ID from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (username) {
      setusername(username);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-2 dark:bg-gray-dark">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8">
          <Image
            width={80}
            height={80}
            src="/images/logo/logo-circle.png"
            alt="Logo"
            priority
            className="mx-auto mb-4"
          />
        </div>

        <div className="w-full max-w-xl bg-white dark:bg-boxdark rounded-lg shadow-default p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Registration Successful!
          </h1>
          {username && (
            <div className="mb-6">
              <p className="text-gray-500 dark:text-gray-400 mb-2">Your Farmer Username is:</p>
              <p className="text-xl font-bold text-primary">{username}</p>
              <button
                onClick={handlePrint}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue py-2 px-4 text-white transition hover:bg-opacity-90"
              >
                <Printer size={20} />
                <span>Print ID</span>
              </button>
            </div>
          )}
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Thank you for registering. Please keep your Farmer Username safe as you will need it to login to your account.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/farmer/login"
              className="w-full winline-block rounded-lg bg-primary py-3 px-8 text-white transition hover:bg-opacity-90"
            >
              Login to Account
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 