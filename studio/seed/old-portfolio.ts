// Content carried over from the owner's previous portfolio (https://labbaiirfan.vercel.app), copied
// word for word from that site. Everything here is the owner's own text; nothing is invented.
// Where the old site gave no information for a Studio field, the field is left empty or set to a
// neutral value and the document is flagged `needsReview` with a note saying so.
import type { SeedDoc } from './data';

const slug = (current: string) => ({ _type: 'slug', current });
const flagged = (reviewNote: string) => ({ needsReview: true, reviewNote });
const OLD = 'Imported from the previous portfolio (labbaiirfan.vercel.app).';

// ── Projects (from the old "Projects" list). Codes continue after the existing P-04. ──────────
export const oldProjects: SeedDoc[] = [
  {
    _type: 'project',
    code: 'P-05',
    title: 'Bank Management System',
    slug: slug('bank-management-system'),
    status: 'learningLab',
    featured: false,
    layout: 'lab',
    summary:
      'A comprehensive system to manage banking operations, including user account management, transaction handling, and balance tracking. This project demonstrates the ability to create efficient, secure, and user-friendly financial applications.',
    tools: ['C++'],
    evidence: [
      {
        _type: 'evidenceLink',
        label: 'Source code',
        url: 'https://github.com/LabbaiIrfan/Bank-Management',
      },
    ],
    stageCoverage: {
      _type: 'stageCoverage',
      commit: 'none',
      build: 'none',
      test: 'none',
      ship: 'none',
      run: 'none',
      observe: 'none',
    },
    ...flagged(
      `${OLD} Status set to Learning lab because the old site gave none. The stage coverage is unknown and left as None. Confirm both.`,
    ),
  },
  {
    _type: 'project',
    code: 'P-06',
    title: 'KofTea',
    slug: slug('koftea'),
    status: 'learningLab',
    featured: false,
    layout: 'lab',
    summary:
      'A visually captivating landing page designed for a fictional coffee and tea brand. This project demonstrates creativity in design and proficiency in creating an engaging, user-friendly interface, showcasing the brand’s identity and products through a clean and modern layout.',
    tools: ['HTML', 'CSS', 'JavaScript'],
    evidence: [
      {
        _type: 'evidenceLink',
        label: 'Source code',
        url: 'https://github.com/LabbaiIrfan/codsoft/tree/main/Landing%20page',
      },
    ],
    stageCoverage: {
      _type: 'stageCoverage',
      commit: 'none',
      build: 'none',
      test: 'none',
      ship: 'none',
      run: 'none',
      observe: 'none',
    },
    ...flagged(
      `${OLD} Status set to Learning lab because the old site gave none. Stage coverage is unknown and left as None. Confirm both.`,
    ),
  },
  {
    _type: 'project',
    code: 'P-07',
    title: 'Calculator',
    slug: slug('calculator'),
    status: 'learningLab',
    featured: false,
    layout: 'lab',
    summary:
      'A fully responsive calculator with an adaptive design for various screen sizes. It features efficient logical operations and an intuitive user interface, demonstrating the ability to create functional and visually appealing web applications.',
    tools: ['HTML', 'CSS', 'JavaScript'],
    evidence: [
      {
        _type: 'evidenceLink',
        label: 'Source code',
        url: 'https://github.com/LabbaiIrfan/codsoft/tree/main/Calculator',
      },
    ],
    stageCoverage: {
      _type: 'stageCoverage',
      commit: 'none',
      build: 'none',
      test: 'none',
      ship: 'none',
      run: 'none',
      observe: 'none',
    },
    ...flagged(
      `${OLD} Status set to Learning lab because the old site gave none. Stage coverage is unknown and left as None. Confirm both.`,
    ),
  },
  {
    _type: 'project',
    code: 'P-08',
    title: 'Personal Portfolio (Django)',
    slug: slug('personal-portfolio-django'),
    status: 'learningLab',
    featured: false,
    layout: 'lab',
    summary:
      'A personal portfolio featuring a contact form that stores user-submitted data in a database. This project highlights the ability to integrate front-end design with back-end functionality, ensuring seamless data collection and user interaction.',
    tools: ['HTML & CSS', 'Python', 'Django'],
    evidence: [
      {
        _type: 'evidenceLink',
        label: 'Source code',
        url: 'https://github.com/LabbaiIrfan/portfolio-django',
      },
    ],
    stageCoverage: {
      _type: 'stageCoverage',
      commit: 'none',
      build: 'none',
      test: 'none',
      ship: 'none',
      run: 'none',
      observe: 'none',
    },
    ...flagged(
      `${OLD} The old title was "Portfolio"; renamed so it is not confused with this site. Status set to Learning lab because the old site gave none. Confirm both.`,
    ),
  },
  {
    _type: 'project',
    code: 'P-09',
    title: 'Bonhomie Event Website',
    slug: slug('bonhomie-event-website'),
    status: 'learningLab',
    featured: false,
    layout: 'lab',
    summary:
      'A dedicated event registration platform for a college event, enabling participants to register and store their details in a database. This project showcases the ability to develop a user-friendly interface with robust back-end functionality for efficient data management.',
    tools: ['React JS', 'Node JS', 'Mongo DB'],
    evidence: [
      {
        _type: 'evidenceLink',
        label: 'Source code',
        url: 'https://github.com/LabbaiIrfan/bonhomie-frontend',
      },
    ],
    stageCoverage: {
      _type: 'stageCoverage',
      commit: 'none',
      build: 'none',
      test: 'none',
      ship: 'none',
      run: 'none',
      observe: 'none',
    },
    ...flagged(
      `${OLD} Status set to Learning lab because the old site gave none; it was a real college event, so this may be Live or Ships with site. Confirm.`,
    ),
  },
];

// ── Experience (from the old "Work Experience" list). These are campus and club roles, so they are
// filed as Education; the Studio has no other kind for them. ──────────────────────────────────────
const role = (
  title: string,
  organisation: string,
  startDate: string,
  endDate: string | null,
  highlights: string[],
): SeedDoc => ({
  _type: 'role',
  kind: 'education',
  title,
  organisation,
  startDate,
  ...(endDate ? { endDate } : {}),
  yearsOnly: false,
  highlights,
  ...flagged(
    `${OLD} Filed as Education because these are campus and club roles. Change the kind if you prefer. Check the dates, which were given as months and are set to the 1st.`,
  ),
});

export const oldRoles: SeedDoc[] = [
  role(
    'Core Design Team Member',
    'Google Developer Group Club (GDGC), AIKTC',
    '2024-09-01',
    '2025-04-01',
    [
      "Led the core design team of the Google Developer Group Club (GDGC) at Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC), demonstrating strong leadership and creative skills.",
      "Conceptualized and designed visually appealing graphics, event posters, and social media content that significantly enhanced the club's digital presence.",
      "Managed and maintained the club's social media handles, ensuring consistent branding and professional presentation.",
      'Conducted a comprehensive workshop on React.js for college students, imparting hands-on experience and fostering practical understanding of web development.',
    ],
  ),
  role(
    'Technical Secretary',
    "Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC)",
    '2024-10-01',
    '2025-09-01',
    [
      'Held the position of Technical Secretary at AIKTC, demonstrating strong leadership, communication, and marketing skills.',
      'Organized and coordinated various college events, managing technical and logistical aspects to ensure successful execution.',
      'Developed a website for college event registration, streamlining the process and enhancing user experience.',
      'Led cross-functional teams to promote events through digital marketing and on-campus campaigns, significantly increasing participation.',
      'Strengthened community engagement by effectively communicating with stakeholders and ensuring smooth coordination.',
    ],
  ),
  role('Core Member', 'CodeChef Club, AIKTC', '2024-10-01', '2025-04-01', [
    'Served as a core member of the CodeChef Club at AIKTC, actively contributing to community growth and skill development.',
    'Organized and conducted multiple workshops, coding contests, and competitive programming events to enhance problem-solving skills among students.',
    'Collaborated with the Programmers Club to organize a 32-hour hackathon, fostering innovation and teamwork.',
    'Promoted a coding culture on campus by encouraging peer learning and collaboration through various events and activities.',
  ]),
  role(
    'Design and Technical Member',
    'Algorithm 9.0 Hackathon, AIKTC',
    '2024-12-01',
    '2025-04-01',
    [
      'Served as a design and technical member for Algorithm 9.0, a 32-hour hackathon held at AIKTC.',
      'Contributed to website development for smooth and efficient event registration.',
      'Designed various banners, posters, and certificates, ensuring a cohesive and professional visual identity for the event.',
      'Collaborated with the organizing team to streamline technical aspects and enhance participant experience.',
    ],
  ),
  role('Global Leadership Team Director', 'Leo Club by Lions International', '2025-07-01', null, [
    'Providing strategic leadership to the Global Leadership Team, driving impactful community service and leadership development initiatives.',
    'Coordinating large-scale social projects in collaboration with Lions International, fostering community engagement and positive change.',
    'Implementing leadership training programs to enhance member skills, motivation, and active involvement.',
    'Formulating and executing strategies to increase member retention and strengthen club engagement.',
    'Overseeing branding and communication efforts to ensure a consistent and professional visual identity.',
    "Establishing partnerships with local organizations to amplify the club's reach and impact.",
  ]),
];

// ── Skills (from the old skill groups). The old site gave no level for these, so each one is
// filed under "Learning" and flagged for review. Move it to At work or In projects if that is true.
const oldSkill = (name: string, group: string): SeedDoc => ({
  _type: 'skill',
  name,
  group,
  tier: 'learning',
  usedIn: [],
  usageNote: '',
  ...flagged(
    `${OLD} Tier set to Learning because the old site gave no level. Move it to At work or In projects if that is true.`,
  ),
});

export const oldSkills: SeedDoc[] = [
  // Languages, frameworks and libraries → Application
  oldSkill('HTML 5', 'application'),
  oldSkill('CSS 3', 'application'),
  oldSkill('JavaScript', 'application'),
  oldSkill('C', 'application'),
  oldSkill('Cpp', 'application'),
  oldSkill('Python', 'application'),
  oldSkill('Java', 'application'),
  oldSkill('Dart', 'application'),
  oldSkill('React JS', 'application'),
  oldSkill('Flutter', 'application'),
  oldSkill('Django', 'application'),
  oldSkill('Tailwind CSS', 'application'),
  // Databases → Data
  oldSkill('Firebase', 'data'),
  oldSkill('MySQL', 'data'),
  oldSkill('MongoDB', 'data'),
  // Tools → Systems & automation
  oldSkill('Git', 'systems'),
  oldSkill('Figma', 'systems'),
  oldSkill('Lightroom', 'systems'),
  oldSkill('VS Code', 'systems'),
  oldSkill('AS Code', 'systems'),
  // Environments → Delivery & cloud
  oldSkill('Node JS', 'delivery'),
  oldSkill('Netlify', 'delivery'),
  oldSkill('Vercel', 'delivery'),
];

// ── Site contact details (from the old site). Only written where the Studio field is empty. ─────
export const oldContact = {
  email: 'Labbaiirfan955@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/labbai-irfan-5085a0288/',
  githubUrl: 'https://github.com/LabbaiIrfan',
  socials: [
    {
      _type: 'socialLink',
      label: 'Instagram',
      url: 'https://www.instagram.com/iffuu.9?igsh=NnE0enljeW5jNTRm',
    },
    {
      _type: 'socialLink',
      label: 'Résumé (Google Drive, from the old site)',
      url: 'https://drive.google.com/file/d/1IZ2gMVp9ymxx1lB28-gLci23Ad-3zQmb/view?usp=drive_link',
    },
  ],
};
