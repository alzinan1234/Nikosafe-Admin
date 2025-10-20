// New mock data for registrations
let registrations = [
    {
        id: 'REG001',
        name: 'Mason Brooks',
        avatar: '/avatars/avatar_mason.png',
        email: 'mason.brooks@gmail.com',
        trainerDetails: {
            id: 'TRAINER1234',
            name: 'John Smith',
            avatar: '/avatars/john_smith_avatar.png',
            email: 'john.smith@gmail.com',
            yearsOfExperience: 10,
            perHourRate: 50,
            coachingExpertise: 'Doubles Strategy',
            bio: 'With over 12 years of coaching experience, Coach John specializes in doubles strategy, footwork mastery, and tournament preparation. An IPTPA-certified instructor and former national champion, he has helped players of all levels refine their technique and elevate their game. Passionate about precision, solid strategy, Coach John\'s training focuses on building confidence, smart shot selection, and court awareness. Whether you\'re a beginner or a competitive player, his tailored coaching approach ensures measurable improvement and on-court success. 🏆🎾',
            achievements: [
                'Certified IPTPA Level II Coach - Recognized for excellence in player development',
                'Coached 100+ Players to Tournament Wins - Including state and national titles',
                'Former Professional Player - Competed in 8 National/Tournament National at elite level',
                'Featured Speaker at Pickleball Summits - Conducted training workshops and strategy sessions',
                'Top-Ranked Doubles Player - Dominated competitive circuits',
                'Developed Training Programs for Elite Players - Customized drills and performance-based coaching'
            ],
            location: 'Downtown Los Angeles, CA',
            preferredTrainingLocations: ['Downtown Los Angeles, CA', 'Santa Monica, CA'],
            availability: 'Monday to Friday',
            timeSlots: ['10:40 AM - 11:00 AM', '11:00 AM - 11:30 AM', '02:00 PM - 02:30 PM']
        }
    },
    {
        id: 'REG002',
        name: 'Emily Chen',
        avatar: '/avatars/avatar_emily.png',
        email: 'emily.chen@example.com',
        trainerDetails: {
            id: 'TRAINER5678',
            name: 'Sarah Lee',
            avatar: '/avatars/sarah_lee_avatar.png',
            email: 'sarah.lee@example.com',
            yearsOfExperience: 7,
            perHourRate: 45,
            coachingExpertise: 'Singles Tactics',
            bio: 'Sarah is an experienced coach focusing on singles play, agility, and mental toughness. She helps players build strong offensive and defensive strategies.',
            achievements: ['Former collegiate player', 'Coached regional champions'],
            location: 'Santa Monica, CA',
            preferredTrainingLocations: ['Santa Monica, CA'],
            availability: 'Tuesday, Thursday',
            timeSlots: ['09:00 AM - 09:30 AM', '03:00 PM - 03:30 PM']
        }
    },
    {
        id: 'REG003',
        name: 'David Rodriguez',
        avatar: '/avatars/avatar_david.png',
        email: 'david.r@example.com',
        trainerDetails: {
            id: 'TRAINER9101',
            name: 'Michael Green',
            avatar: '/avatars/michael_green_avatar.png',
            email: 'michael.g@example.com',
            yearsOfExperience: 12,
            perHourRate: 55,
            coachingExpertise: 'All-around Game',
            bio: 'Michael is a versatile coach providing comprehensive training for all aspects of pickleball, from beginner fundamentals to advanced techniques.',
            achievements: ['National certified coach', 'Developed youth programs'],
            location: 'Long Beach, CA',
            preferredTrainingLocations: ['Long Beach, CA', 'Irvine, CA'],
            availability: 'Monday, Wednesday, Friday',
            timeSlots: ['08:00 AM - 08:30 AM', '01:00 PM - 01:30 PM']
        }
    },
    {
        id: 'REG004',
        name: 'Sophia Williams',
        avatar: '/avatars/avatar_sophia.png',
        email: 'sophia.w@example.com',
        trainerDetails: {
            id: 'TRAINER1122',
            name: 'Jessica Blue',
            avatar: '/avatars/jessica_blue_avatar.png',
            email: 'jessica.b@example.com',
            yearsOfExperience: 5,
            perHourRate: 40,
            coachingExpertise: 'Beginner Fundamentals',
            bio: 'Jessica specializes in introducing new players to pickleball, focusing on basic strokes, rules, and court positioning to build a strong foundation.',
            achievements: ['Certified Level 1 Instructor', 'Community Pickleball Organizer'],
            location: 'Anaheim, CA',
            preferredTrainingLocations: ['Anaheim, CA'],
            availability: 'Weekends',
            timeSlots: ['09:00 AM - 09:30 AM', '10:00 AM - 10:30 AM']
        }
    },
    {
        id: 'REG005',
        name: 'Ethan Miller',
        avatar: '/avatars/avatar_ethan.png',
        email: 'ethan.m@example.com',
        trainerDetails: {
            id: 'TRAINER3344',
            name: 'Chris Red',
            avatar: '/avatars/chris_red_avatar.png',
            email: 'chris.r@example.com',
            yearsOfExperience: 9,
            perHourRate: 52,
            coachingExpertise: 'Advanced Drills',
            bio: 'Chris offers high-intensity training sessions designed for competitive players looking to refine advanced techniques, develop new shots, and improve game strategy.',
            achievements: ['Pro-Am Tournament Winner', 'Advanced Coaching Certification'],
            location: 'Pasadena, CA',
            preferredTrainingLocations: ['Pasadena, CA', 'Glendale, CA'],
            availability: 'Monday, Tuesday, Thursday',
            timeSlots: ['05:00 PM - 05:30 PM', '06:00 PM - 06:30 PM']
        }
    },
    {
        id: 'REG006',
        name: 'Olivia Martinez',
        avatar: '/avatars/avatar_olivia.png',
        email: 'olivia.m@example.com',
        trainerDetails: {
            id: 'TRAINER5566',
            name: 'Patricia White',
            avatar: '/avatars/patricia_white_avatar.png',
            email: 'patricia.w@example.com',
            yearsOfExperience: 6,
            perHourRate: 48,
            coachingExpertise: 'Fitness for Pickleball',
            bio: 'Patricia combines pickleball coaching with fitness training, helping players improve their endurance, strength, and agility on the court.',
            achievements: ['Certified Personal Trainer', 'Sports Nutrition Specialist'],
            location: 'Irvine, CA',
            preferredTrainingLocations: ['Irvine, CA'],
            availability: 'Wednesday, Friday, Saturday',
            timeSlots: ['07:00 AM - 07:30 AM', '04:00 PM - 04:30 PM']
        }
    },
    {
        id: 'REG007',
        name: 'James Wilson',
        avatar: '/avatars/avatar_james.png',
        email: 'james.w@example.com',
        trainerDetails: {
            id: 'TRAINER7788',
            name: 'Robert Brown',
            avatar: '/avatars/robert_brown_avatar.png',
            email: 'robert.b@example.com',
            yearsOfExperience: 15,
            perHourRate: 60,
            coachingExpertise: 'Mental Game & Strategy',
            bio: 'Robert focuses on the psychological aspects of pickleball, helping players develop strong mental resilience, strategic thinking, and match-play tactics.',
            achievements: ['Sports Psychologist', 'Former Professional Player'],
            location: 'San Diego, CA',
            preferredTrainingLocations: ['San Diego, CA'],
            availability: 'Monday, Tuesday, Wednesday',
            timeSlots: ['10:00 AM - 10:30 AM', '11:00 AM - 11:30 AM']
        }
    },
    {
        id: 'REG008',
        name: 'Ava Taylor',
        avatar: '/avatars/avatar_ava.png',
        email: 'ava.t@example.com',
        trainerDetails: {
            id: 'TRAINER9900',
            name: 'Linda Hall',
            avatar: '/avatars/linda_hall_avatar.png',
            email: 'linda.h@example.com',
            yearsOfExperience: 4,
            perHourRate: 38,
            coachingExpertise: 'Youth Development',
            bio: 'Linda is passionate about introducing pickleball to younger players, creating fun and engaging lessons that build fundamental skills and foster a love for the game.',
            achievements: ['Youth Sports Coach', 'Certified Pickleball Instructor'],
            location: 'Orange County, CA',
            preferredTrainingLocations: ['Orange County, CA'],
            availability: 'Weekends',
            timeSlots: ['01:00 PM - 01:30 PM', '02:00 PM - 02:30 PM']
        }
    },
    {
        id: 'REG009',
        name: 'William Jones',
        avatar: '/avatars/avatar_william.png',
        email: 'william.j@example.com',
        trainerDetails: {
            id: 'TRAINER0011',
            name: 'Kevin Davis',
            avatar: '/avatars/kevin_davis_avatar.png',
            email: 'kevin.d@example.com',
            yearsOfExperience: 11,
            perHourRate: 53,
            coachingExpertise: 'Tournament Preparation',
            bio: 'Kevin offers specialized coaching for players aiming to compete in tournaments, covering advanced strategies, pressure management, and match simulation.',
            achievements: ['Tournament Champion', 'Pro-level Coach'],
            location: 'Los Angeles, CA',
            preferredTrainingLocations: ['Los Angeles, CA', 'Culver City, CA'],
            availability: 'Tuesday, Thursday, Saturday',
            timeSlots: ['09:30 AM - 10:00 AM', '04:30 PM - 05:00 PM']
        }
    },
    {
        id: 'REG010',
        name: 'Sophia Brown',
        avatar: '/avatars/avatar_sophia_b.png',
        email: 'sophia.b@example.com',
        trainerDetails: {
            id: 'TRAINER2233',
            name: 'Nancy Wilson',
            avatar: '/avatars/nancy_wilson_avatar.png',
            email: 'nancy.w@example.com',
            yearsOfExperience: 8,
            perHourRate: 47,
            coachingExpertise: 'Footwork & Agility',
            bio: 'Nancy helps players improve their on-court movement, quickness, and balance through targeted footwork and agility drills.',
            achievements: ['Certified Fitness Coach', 'Former Track Athlete'],
            location: 'Ventura, CA',
            preferredTrainingLocations: ['Ventura, CA'],
            availability: 'Monday, Wednesday, Friday',
            timeSlots: ['08:30 AM - 09:00 AM', '03:30 PM - 04:00 PM']
        }
    }
];


export const getAllRegistrations = () => {
    return [...registrations];
};

// export const getRegistrationById = (id) => {
//     return registrations.find(reg => reg.id === id);
// };

export const deleteRegistration = (id) => {
    const initialLength = registrations.length;
    registrations = registrations.filter(reg => reg.id !== id);
    if (registrations.length < initialLength) {
        console.log(`Registration ${id} deleted.`);
        return true;
    }
    return false;
};