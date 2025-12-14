interface BlogAuthor {
  name: string;
  role: string;
  company: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: number;
  author: BlogAuthor;
}

// Mock blog posts data
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Managing Remote Teams Effectively",
    excerpt:
      "Discover proven strategies for leading distributed teams and maintaining productivity across time zones.",
    content: `<p>Working with remote teams has become the norm for many organizations, but managing these teams effectively requires a different approach than traditional office settings.</p>
    <p>In this article, we'll explore 10 essential tips for leading remote teams successfully:</p>
    <ol>
      <li><strong>Establish Clear Communication Channels</strong> - Define which tools to use for different types of communication</li>
      <li><strong>Set Clear Expectations</strong> - Document goals, deadlines, and deliverables clearly</li>
      <li><strong>Embrace Asynchronous Work</strong> - Respect different time zones and working schedules</li>
      <li><strong>Invest in the Right Tools</strong> - Use project management and collaboration software effectively</li>
      <li><strong>Foster Team Connections</strong> - Schedule regular virtual team-building activities</li>
      <li><strong>Provide Regular Feedback</strong> - Schedule consistent one-on-ones and team retrospectives</li>
      <li><strong>Focus on Outcomes, Not Activity</strong> - Measure success by results rather than hours worked</li>
      <li><strong>Create a Strong Onboarding Process</strong> - Ensure new hires feel welcomed and equipped</li>
      <li><strong>Prioritize Mental Health</strong> - Encourage work-life balance and provide support</li>
      <li><strong>Lead by Example</strong> - Model the behaviors and practices you want to see</li>
    </ol>
    <p>By implementing these strategies, you can build a productive, engaged, and cohesive remote team that delivers exceptional results.</p>`,
    category: "Management",
    publishedAt: "2025-10-15T00:00:00Z",
    readTime: 5,
    author: {
      name: "Sarah Johnson",
      role: "Head of Operations",
      company: "SkillSync",
    },
  },
  {
    id: "2",
    title: "The Future of Freelance Marketplaces",
    excerpt:
      "How platforms like SkillSync are reshaping the gig economy with advanced collaboration tools.",
    content: `<p>The freelance economy has experienced unprecedented growth over the past decade, and platforms like SkillSync are at the forefront of this transformation.</p>
    <p>Today's freelance marketplaces are evolving beyond simple job boards to become comprehensive ecosystems that support the entire freelance lifecycle:</p>
    <h3>Enhanced Matching Algorithms</h3>
    <p>Modern platforms leverage AI and machine learning to match freelancers with projects that align with their skills, experience, and preferences, resulting in higher satisfaction rates for both parties.</p>
    <h3>Integrated Project Management</h3>
    <p>Rather than juggling multiple tools, freelancers and clients can now manage everything from initial discussions to final delivery within a single platform.</p>
    <h3>Secure Payment Systems</h3>
    <p>Escrow services and milestone-based payments protect both freelancers and clients, reducing disputes and building trust in the ecosystem.</p>
    <h3>Professional Development Opportunities</h3>
    <p>Leading platforms now offer training, certification programs, and skill assessments to help freelancers continuously improve and command higher rates.</p>
    <h3>Community and Networking</h3>
    <p>Virtual events, forums, and mentorship programs help freelancers build valuable professional relationships and grow their networks.</p>
    <p>As we look to the future, expect to see even more innovation in areas like blockchain-based contracts, virtual reality collaboration spaces, and predictive analytics for project success.</p>`,
    category: "Industry Trends",
    publishedAt: "2025-10-08T00:00:00Z",
    readTime: 7,
    author: {
      name: "Michael Chen",
      role: "Product Director",
      company: "SkillSync",
    },
  },
  {
    id: "3",
    title: "Maximizing Your Earnings on SkillSync",
    excerpt:
      "Expert advice on building a strong profile, setting competitive rates, and winning more projects.",
    content: `<p>Earning potential on freelance platforms varies widely among users. Some freelancers consistently book high-paying projects while others struggle to find work. What sets successful freelancers apart?</p>
    <h3>Crafting a Compelling Profile</h3>
    <p>Your profile is often the first impression you make on potential clients. A strong profile includes:</p>
    <ul>
      <li>A professional photo that conveys approachability and expertise</li>
      <li>A compelling headline that highlights your unique value proposition</li>
      <li>A detailed bio that tells your story and showcases your experience</li>
      <li>High-quality portfolio samples that demonstrate your skills</li>
      <li>Relevant skills and certifications prominently displayed</li>
      <li>Positive reviews and testimonials from previous clients</li>
    </ul>
    <h3>Pricing Strategies</h3>
    <p>Setting the right price is crucial for attracting clients while ensuring fair compensation:</p>
    <ul>
      <li>Research market rates for similar services in your niche</li>
      <li>Consider offering tiered packages to appeal to different budgets</li>
      <li>Highlight the value you provide, not just the cost</li>
      <li>Be prepared to negotiate but know your minimum acceptable rate</li>
    </ul>
    <h3>Winning Proposals</h3>
    <p>Standing out in a sea of proposals requires a strategic approach:</p>
    <ul>
      <li>Tailor each proposal to the specific project requirements</li>
      <li>Demonstrate understanding of the client's business and challenges</li>
      <li>Include relevant examples of past work</li>
      <li>Clearly outline your approach and timeline</li>
      <li>Proofread carefully to avoid typos and grammatical errors</li>
    </ul>
    <p>By focusing on these key areas, you can significantly increase your chances of booking profitable projects on SkillSync.</p>`,
    category: "Freelancing",
    publishedAt: "2025-10-01T00:00:00Z",
    readTime: 4,
    author: {
      name: "Emma Rodriguez",
      role: "Freelancer Success Manager",
      company: "SkillSync",
    },
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockBlogPosts;
}

export async function getBlogPost(id: string): Promise<BlogPost | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockBlogPosts.find((post) => post.id === id);
}
