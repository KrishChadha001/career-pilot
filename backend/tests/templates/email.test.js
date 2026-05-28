import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import assert from 'node:assert';
import { 
  __setMockTransport,
  sendJobApplicationEmail,
  sendMatchingJobMail,
  sendJobAlertEmail,
  sendWeeklyDigestEmail,
  sendProposalApprovalEmail,
  sendLockoutAlertEmail,
  sendVerificationEmail
} from '../../src/services/mailService.js';

// Setup mock before running tests
process.env.EMAIL_SERVICE_URL = '';
process.env.EMAIL_API_KEY = '';

let lastMailOptions = null;
__setMockTransport({
  sendMail: async (options) => {
    lastMailOptions = options;
    return { messageId: 'mock-id' };
  }
});

describe('Email Templates Snapshot Tests', () => {
  beforeEach(() => {
    lastMailOptions = null;
    vi.useFakeTimers({ now: new Date('2023-01-01T12:00:00Z') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('sendJobApplicationEmail template', async () => {
    await sendJobApplicationEmail({
      recruiterEmail: 'recruiter@example.com',
      recruiterName: 'John Doe',
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      applicantName: 'Jane Smith',
      applicantEmail: 'jane@example.com',
      applicantPhone: '1234567890',
      message: 'Here is my application.'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendMatchingJobMail template', async () => {
    await sendMatchingJobMail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      jobDescription: 'Great job',
      jobLocation: 'Remote',
      jobType: 'Full-time',
      salary: '$100k',
      applyLink: 'https://example.com/apply',
      postedDate: '2023-01-01'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendJobAlertEmail template', async () => {
    await sendJobAlertEmail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      alertTitle: 'Software Engineering Jobs',
      jobs: [
        {
          title: 'Frontend Dev',
          company: 'Web Corp',
          location: 'New York',
          applyLink: 'https://example.com/job1'
        },
        {
          title: 'Backend Dev',
          company: 'Data Corp',
          location: 'San Francisco',
          applyLink: 'https://example.com/job2'
        }
      ]
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendWeeklyDigestEmail template', async () => {
    await sendWeeklyDigestEmail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      html: '<h1>Weekly Digest</h1><p>Here are your updates...</p>'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendProposalApprovalEmail template', async () => {
    await sendProposalApprovalEmail({
      studentEmail: 'student@example.com',
      studentName: 'Jane Smith',
      challengeTitle: 'Build a Website',
      companyName: 'Tech Corp',
      corporateName: 'Tech Corp Inc',
      proposedPrice: 5000,
      estimatedDays: 14,
      feedback: 'Looks good!',
      chatRoomId: 'room123'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendLockoutAlertEmail template', async () => {
    await sendLockoutAlertEmail({
      email: 'user@example.com',
      ip: '192.168.1.1',
      lockoutUntil: '2023-01-01T12:00:00Z'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

  test('sendVerificationEmail template', async () => {
    await sendVerificationEmail({
      email: 'user@example.com',
      code: '123456'
    });
    expect(lastMailOptions.html).toMatchSnapshot();
  });

});
