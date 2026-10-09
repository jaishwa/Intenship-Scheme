import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://y8nqjdbs.ap-southeast.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTkyMTF9.OyUpWM9ftzS6yq_MB254wpI3sP71zTJgClFhbG-gEjc'
});

async function test() {
  console.log('Invoking function...');
  const { data, error } = await client.functions.invoke('send-email-notification', {
    body: {
      studentEmail: 'jaishwasenthil05@gmail.com',
      studentName: 'Jaishwa Senthil',
      action: 'approved',
      companyName: 'FUTURE FIT LTD',
      role: 'Full Stack Developer Intern'
    }
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

test();
