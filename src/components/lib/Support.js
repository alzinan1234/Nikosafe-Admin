// lib/data.js

let supportTickets = [
    {
        id: 'SUP001',
        submittedBy: 'Alice Johnson',
        avatar: '/image/userImage.png',
        title: 'Login Issue on Dashboard',
        issueDescription: 'I am unable to log in to my dashboard. After entering credentials, the page just refreshes. No error message is displayed. Tried clearing cache and cookies, but the issue persists.',
        dateSubmitted: '2023-10-26',
        status: 'Open',
        assignedTo: 'John Doe',
        priority: 'High',
        comments: [
            { id: 1, user: 'Admin', text: 'Received ticket. Investigating...', date: '2023-10-26 10:30' },
            { id: 2, user: 'Alice Johnson', text: 'Still facing the problem.', date: '2023-10-27 09:00' }
        ]
    },
    {
        id: 'SUP002',
        submittedBy: 'Bob Williams',
        avatar: '/image/userImage.png',
        title: 'Cannot upload files',
        issueDescription: 'When I try to upload a document to my profile, it gets stuck at 0% and eventually times out. This happens with all file types and sizes. My internet connection is stable.',
        dateSubmitted: '2023-10-25',
        status: 'Pending',
        assignedTo: 'Jane Smith',
        priority: 'Medium',
        comments: [
            { id: 1, user: 'Admin', text: 'Checked file server. No immediate issues found.', date: '2023-10-25 14:15' }
        ]
    },
    {
        id: 'SUP003',
        submittedBy: 'Charlie Brown',
        avatar: '/image/userImage.png',
        title: 'Billing discrepancy',
        issueDescription: 'My last invoice shows an incorrect charge for a service I did not use. The amount is $50 higher than expected. Please review and correct.',
        dateSubmitted: '2023-10-24',
        status: 'Resolved',
        assignedTo: 'Admin',
        priority: 'High',
        comments: [
            { id: 1, user: 'Admin', text: 'Issue reviewed. Corrected billing and re-issued invoice.', date: '2023-10-24 16:00' }
        ]
    },
    {
        id: 'SUP004',
        submittedBy: 'Diana Prince',
        avatar: '/image/userImage.png',
        title: 'Feature request: Dark Mode',
        issueDescription: 'I would love to see a dark mode option for the application interface. It would be much easier on the eyes, especially during night use.',
        dateSubmitted: '2023-10-23',
        status: 'Open',
        assignedTo: 'Product Team',
        priority: 'Low',
        comments: []
    },
    {
        id: 'SUP005',
        submittedBy: 'Eve Adams',
        avatar: '/image/userImage.png',
        title: 'Broken link in footer',
        issueDescription: 'The "Terms of Service" link in the footer section of the website leads to a 404 error page. Please fix this.',
        dateSubmitted: '2023-10-22',
        status: 'Open',
        assignedTo: 'Web Dev',
        priority: 'Medium',
        comments: []
    },
    {
        id: 'SUP006',
        submittedBy: 'Frank White',
        avatar: '/image/userImage.png',
        title: 'Forgot password email not arriving',
        issueDescription: 'I requested a password reset, but the email never arrived in my inbox or spam folder. My email address is frank.w@example.com.',
        dateSubmitted: '2023-10-21',
        status: 'Pending',
        assignedTo: 'Support Team',
        priority: 'High',
        comments: []
    },
    {
        id: 'SUP007',
        submittedBy: 'Grace Kelly',
        avatar: '/image/userImage.png',
        title: 'Slow performance on reports page',
        issueDescription: 'The reports generation page is extremely slow, sometimes taking several minutes to load or even crashing the browser. This started happening yesterday.',
        dateSubmitted: '2023-10-20',
        status: 'Open',
        assignedTo: 'Backend Team',
        priority: 'High',
        comments: []
    },
    {
        id: 'SUP008',
        submittedBy: 'Henry Ford',
        avatar: '/image/userImage.png',
        title: 'Typo on about us page',
        issueDescription: 'There is a typo on the "About Us" page, under the "Our Mission" section. "Excellence" is spelled as "Excllence".',
        dateSubmitted: '2023-10-19',
        status: 'Resolved',
        assignedTo: 'Content Team',
        priority: 'Low',
        comments: []
    },
    {
        id: 'SUP009',
        submittedBy: 'Ivy Green',
        avatar: '/image/userImage.png',
        title: 'Mobile app crashing',
        issueDescription: 'The mobile application (iOS) crashes immediately after opening. It was working fine yesterday. I have reinstalled it, but the issue persists.',
        dateSubmitted: '2023-10-18',
        status: 'Open',
        assignedTo: 'Mobile Dev Team',
        priority: 'High',
        comments: []
    },
    {
        id: 'SUP010',
        submittedBy: 'Jack Black',
        avatar: '/image/userImage.png',
        title: 'Payment gateway error',
        issueDescription: 'When attempting to complete a purchase, I receive an error message "Payment processing failed". My card details are correct.',
        dateSubmitted: '2023-10-17',
        status: 'Pending',
        assignedTo: 'Finance Support',
        priority: 'High',
        comments: []
    },
    {
        id: 'SUP011',
        submittedBy: 'Karen Smith',
        avatar: '/image/userImage.png', // Reusing avatar
        title: 'Account Verification Delay',
        issueDescription: 'My account verification has been pending for over 3 days. I submitted all required documents. Can you please expedite this process?',
        dateSubmitted: '2023-10-16',
        status: 'Pending',
        assignedTo: 'Compliance Team',
        priority: 'Medium',
        comments: []
    },
    {
        id: 'SUP012',
        submittedBy: 'Liam Neeson',
        avatar: '/image/userImage.png', // Reusing avatar
        title: 'Notification Preferences not saving',
        issueDescription: 'I updated my email notification preferences, but they revert to default settings every time I log back in. Changes are not being saved.',
        dateSubmitted: '2023-10-15',
        status: 'Open',
        assignedTo: 'Frontend Team',
        priority: 'Low',
        comments: []
    },
    {
        id: 'SUP013',
        submittedBy: 'Mia Davis',
        avatar: '/image/userImage.png', // Reusing avatar
        title: 'Data export limit issue',
        issueDescription: 'I am trying to export data for the last 6 months, but the system only allows exports for a maximum of 3 months. This is affecting my reporting.',
        dateSubmitted: '2023-10-14',
        status: 'Open',
        assignedTo: 'Data Engineering',
        priority: 'High',
        comments: []
    },
    {
        id: 'SUP014',
        submittedBy: 'Noah Wilson',
        avatar: '/image/userImage.png', // Reusing avatar
        title: 'Chat support not working',
        issueDescription: 'The live chat support feature on your website is unresponsive. I tried multiple times but cannot connect to an agent.',
        dateSubmitted: '2023-10-13',
        status: 'Pending',
        assignedTo: 'Customer Service',
        priority: 'Medium',
        comments: []
    },
    {
        id: 'SUP015',
        submittedBy: 'Olivia Moore',
        avatar: '/image/userImage.png', // Reusing avatar
        title: 'Subscription cancellation problem',
        issueDescription: 'I attempted to cancel my subscription through the settings, but it keeps showing as active. I need to cancel it immediately.',
        dateSubmitted: '2023-10-12',
        status: 'Open',
        assignedTo: 'Billing Team',
        priority: 'High',
        comments: []
    },
];

export const getTicketById = (id) => {
    return supportTickets.find(ticket => ticket.id === id);
};

export const getAllTickets = () => {
    return [...supportTickets]; // Return a copy to prevent direct mutation outside these functions
};

export const updateTicketStatus = (id, newStatus) => {
    const ticketIndex = supportTickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex > -1) {
        supportTickets[ticketIndex].status = newStatus;
        // In a real app, you'd send this update to a backend API
        console.log(`Ticket ${id} status updated to: ${newStatus}`);
        return true;
    }
    return false;
};

export const deleteTicket = (id) => {
    const initialLength = supportTickets.length;
    supportTickets = supportTickets.filter(ticket => ticket.id !== id);
    // In a real app, you'd send a delete request to a backend API
    if (supportTickets.length < initialLength) {
        console.log(`Ticket ${id} deleted.`);
        return true;
    }
    return false;
};