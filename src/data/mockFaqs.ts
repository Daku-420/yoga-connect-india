export interface YogaFAQ {
  id: string;
  number: number;
  question: string;
  answer: string;
  category: 'Timing & Nutrition' | 'Beginners & Flexibility' | 'Health & Pregnancy' | 'Routine & Frequency' | 'Props & Gear' | 'Safety & Teachers' | 'Language & Culture' | 'Fitness & Transformation';
  tags: string[];
}

export const mockYogaFaqs: YogaFAQ[] = [
  {
    id: 'faq-1',
    number: 1,
    question: 'How long do I wait after eating before I can do yoga?',
    answer: 'If you can practice in the morning before you eat, that is ideal, or later in the evening. However, other than those times, we recommend waiting at least 2 hours after you eat before you start your yoga practice. Doing yoga on a full stomach can cause discomfort and even nausea. It also means you’ll have less energy since your body is busy digesting food!',
    category: 'Timing & Nutrition',
    tags: ['eating', 'digestion', 'morning practice', 'meal timing']
  },
  {
    id: 'faq-2',
    number: 2,
    question: 'Do I have to be flexible to practice yoga?',
    answer: 'Absolutely not! As a matter of fact, lack of flexibility is a good reason to start a regular yoga practice. Yoga is much more than just stretching. It’s a physical and spiritual activity that tones, strengthens, calms, and heals the body, mind, and spirit regardless of your current range of motion.',
    category: 'Beginners & Flexibility',
    tags: ['flexibility', 'beginners', 'stretching', 'body types']
  },
  {
    id: 'faq-3',
    number: 3,
    question: 'I’m pregnant. Can I still do yoga?',
    answer: 'Yes you can! It’s important when you’re pregnant to do yoga under the guidance of a prenatal yoga instructor or an expert yoga teacher. There are yoga poses that pregnant women should avoid, such as deep inversions, extreme twists, and poses where you lie flat on your back.',
    category: 'Health & Pregnancy',
    tags: ['pregnancy', 'prenatal', 'safety', 'modifications']
  },
  {
    id: 'faq-4',
    number: 4,
    question: 'How often should I practice yoga for best results?',
    answer: 'If you’re a beginner, we recommend starting with 2–3 classes that require more exertion a week (such as Ashtanga, Power, or Vinyasa yoga). However, there are many other types of yoga to try in between, such as restorative yoga, yin yoga, or meditative yoga classes. As you advance in your practice, you may feel strong enough to try more challenging classes more often. Either way, you’ll experience the benefits of yoga whether you do it once a week or 7 days a week!',
    category: 'Routine & Frequency',
    tags: ['frequency', 'schedule', 'vinyasa', 'restorative']
  },
  {
    id: 'faq-5',
    number: 5,
    question: 'Do I need any special equipment to practice yoga?',
    answer: 'While we do recommend the use of a non-slip yoga mat, technically, you don’t have to have one. You can practice yoga on any surface you feel is safe and comfortable. Many yogis also have blocks, bolsters, and straps to help them modify poses or go deeper into poses. But those certainly aren’t necessary to reap the benefits of doing yoga.',
    category: 'Props & Gear',
    tags: ['yoga mat', 'props', 'blocks', 'straps', 'equipment']
  },
  {
    id: 'faq-6',
    number: 6,
    question: 'Why do I need a yoga class? Can’t I just do it by myself with a book or video?',
    answer: 'You certainly can do yoga by yourself with the use of a book or video, but most yogis (especially beginners) agree that this isn’t as safe as practicing yoga with a live certified teacher. Yoga classes allow your teacher to observe how you perform poses, correct alignment, and help you make appropriate modifications and adjustments. Doing yoga poses incorrectly may cause injuries.',
    category: 'Safety & Teachers',
    tags: ['teachers', 'self practice', 'alignment', 'injury prevention']
  },
  {
    id: 'faq-7',
    number: 7,
    question: 'What kind of clothes do I need to practice yoga?',
    answer: 'Despite what you may see on social media, you do not need a specific brand or expensive clothing, including the ever-popular designer yoga pants. The best clothes for yoga are simply comfortable, breathable ones that you can move freely in. You’ll practice barefoot or, if you’d prefer, in non-slip yoga grip socks.',
    category: 'Props & Gear',
    tags: ['clothing', 'what to wear', 'barefoot', 'comfort']
  },
  {
    id: 'faq-8',
    number: 8,
    question: 'What are all the strange terms I hear my yoga teacher saying?',
    answer: 'Many yoga instructors commonly use traditional Sanskrit words for yoga poses, breathwork, and philosophy instead of the English translation. This is a wonderful thing! Yoga is ancient and rooted in Indian tradition, and continuing to use and pass on the language is an important part of maintaining the sacred culture and anatomical precision of yoga. If you don’t understand something your instructor is saying, please ask!',
    category: 'Language & Culture',
    tags: ['sanskrit', 'terminology', 'tradition', 'namaste']
  },
  {
    id: 'faq-9',
    number: 9,
    question: 'Will yoga get or keep me in shape?',
    answer: 'If you practice regularly and eat healthfully, yes! Absolutely! Just like with any physical activity, you won’t see continued results unless you practice regularly. How you fuel your body is also a large part of getting physically and mentally healthy. Yoga can be as strenuous as cardio or as gentle as your regular post-workout stretch and everything in between. It is definitely possible for yoga to help you lose weight, tone muscles, and build core strength.',
    category: 'Fitness & Transformation',
    tags: ['weight loss', 'strength', 'fitness', 'toning', 'cardio']
  },
  {
    id: 'faq-10',
    number: 10,
    question: 'Can I do yoga if I’m injured or have a physical disability?',
    answer: 'Yes, you can! Yoga is for every body—meaning any body type, shape, size, and all ability levels. Highly trained and experienced authentic yoga teachers come equipped with credentials, anatomical understanding, and adaptive tools to help you practice yoga safely with chair options, wall supports, and personalized modifications that work for your healing journey.',
    category: 'Health & Pregnancy',
    tags: ['injuries', 'disability', 'adaptive yoga', 'accessibility']
  },
  {
    id: 'faq-11',
    number: 11,
    question: 'Why should I start practicing yoga anyway?',
    answer: 'A regular yoga practice provides benefits far beyond what ordinary exercise will do, because yoga is a whole-health discipline. Everything you do in yoga positively affects your physical, mental, and emotional wellbeing, and the benefits carry over into daily life. Yoga eases back pain, relieves joint stiffness, lowers blood pressure, regulates the nervous system, provides mental clarity, reduces stress, and promotes deep healing.',
    category: 'Fitness & Transformation',
    tags: ['benefits', 'mental health', 'healing', 'wellbeing', 'stress relief']
  }
];
