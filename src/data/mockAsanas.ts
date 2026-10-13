import { YogaAsana } from '../types';

export const mockAsanas: YogaAsana[] = [
  {
    id: 'asana-1',
    sanskritName: 'Vrikshasana',
    sanskritDevanagari: 'वृक्षासन',
    englishName: 'Tree Pose',
    pronunciation: 'vrik-SHAH-suh-nuh',
    slug: 'vrikshasana-tree-pose',
    category: 'Standing',
    difficulty: 'Beginner',
    chakra: 'Muladhara (Root Chakra)',
    element: 'Earth (Prithvi)',
    targetMuscles: ['Calves', 'Quadriceps', 'Glutes', 'Ankles', 'Core Abdominals'],
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A classic standing balancing posture cultivating unshakeable mental poise, root stability, and physical equilibrium inspired by Himalayan trees.',
    steps: [
      {
        stepNumber: 1,
        title: 'Establish the Root',
        instruction: 'Stand tall in Tadasana (Mountain Pose) with feet hip-width apart. Spread all ten toes wide and ground evenly through the four corners of your left foot.'
      },
      {
        stepNumber: 2,
        title: 'Draw the Right Foot In',
        instruction: 'Shift your weight onto the left leg. Bend your right knee and place the sole of your right foot against the inner left thigh or inner calf (never directly on the knee joint).'
      },
      {
        stepNumber: 3,
        title: 'Square the Hips',
        instruction: 'Press your right foot firmly into your inner thigh while pressing the thigh back into the foot with equal force. Gently draw your tailbone downward.'
      },
      {
        stepNumber: 4,
        title: 'Anjali Mudra to Sky',
        instruction: 'Bring your palms together at heart center in Anjali Mudra. When stable, slowly inhale and reach both arms overhead like growing branches.'
      },
      {
        stepNumber: 5,
        title: 'Find Drishti & Release',
        instruction: 'Fix your soft gaze on an unmoving point on the wall or horizon. Breathe evenly for 5 to 8 slow breaths, then gently release and switch legs.'
      }
    ],
    anatomicalBenefits: [
      'Strengthens calves, ankles, and inner thighs',
      'Improves neuromuscular coordination and balance reflexes',
      'Gently opens the hips and groin while lengthening the spine',
      'Enhances postural alignment and core stability'
    ],
    mentalBenefits: [
      'Calms mental chatter through single-pointed focus (Ekagrata)',
      'Grounds excess anxiety and nervous energy into the earth',
      'Cultivates emotional patience and resilience'
    ],
    contraindications: [
      'Recent knee or ankle injuries (practice with foot on floor or near a wall)',
      'Severe vertigo or unmanaged high blood pressure (keep hands at heart center rather than overhead)',
      'Acute migraines or insomnia'
    ],
    breathingCue: 'Slow, steady diaphragmatic breaths (Dirga Pranayama) with an effortless pause at the crest of each inhalation.',
    drishti: 'Nasagrai (Tip of Nose) or unmoving eye-level point 6 feet ahead',
    recommendedHold: '30 to 60 seconds per leg',
    proTips: [
      'Press your foot and inner thigh equally against each other to create midline stability.',
      'Engage Mula Bandha (pelvic floor lock) lightly to prevent wobbling.'
    ],
    seoKeywords: [
      'vrikshasana steps and benefits',
      'how to do tree pose yoga',
      'vrikshasana benefits for beginners',
      'tree pose sanskrit name alignment',
      'standing yoga poses'
    ],
    faqs: [
      {
        question: 'Can beginners place the foot on the knee in Tree Pose?',
        answer: 'No. Never place the foot directly on the knee joint, as sideways pressure can strain delicate ligaments. Place the foot on the inner thigh or calf, or keep toes resting lightly on the floor.'
      },
      {
        question: 'What chakra is activated during Vrikshasana?',
        answer: 'Vrikshasana primarily activates the Muladhara (Root Chakra), fostering groundedness, safety, and physical stability, as well as the Anahata (Heart Chakra) when hands are in prayer.'
      }
    ]
  },

  {
    id: 'asana-2',
    sanskritName: 'Bhujangasana',
    sanskritDevanagari: 'भुजङ्गासन',
    englishName: 'Cobra Pose',
    pronunciation: 'bhoo-jang-GAH-suh-nuh',
    slug: 'bhujangasana-cobra-pose',
    category: 'Backbends',
    difficulty: 'Beginner',
    chakra: 'Anahata (Heart Chakra)',
    element: 'Fire (Agni) & Air (Vayu)',
    targetMuscles: ['Erector Spinae', 'Deltoids', 'Pectoralis Major', 'Latissimus Dorsi', 'Gluteus Maximus'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A revitalizing prone backbend mimicking a rising serpent that expands the chest, strengthens the entire dorsal spine, and awakens the digestive fire.',
    steps: [
      {
        stepNumber: 1,
        title: 'Prone Starting Position',
        instruction: 'Lie flat on your stomach on your yoga mat. Keep your legs extended hip-width apart with the tops of your feet pressing firmly into the ground.'
      },
      {
        stepNumber: 2,
        title: 'Hand Placement',
        instruction: 'Place your palms flat on the mat directly under your shoulders. Hug your elbows tight alongside your ribcage, pointing backward.'
      },
      {
        stepNumber: 3,
        title: 'Engage Pelvis & Legs',
        instruction: 'Gently press your pubic bone into the mat and firm your thighs. Roll your shoulders back and down away from your ears.'
      },
      {
        stepNumber: 4,
        title: 'Inhale & Elevate Chest',
        instruction: 'On a deep inhalation, use your spinal muscles to lift your chest off the floor. Keep minimal weight in your hands; avoid jamming into the lower back.'
      },
      {
        stepNumber: 5,
        title: 'Expand the Heart',
        instruction: 'Keep the back of your neck long with the chin slightly drawn in. Hold for 4 to 6 breaths, then exhale smoothly to lower your forehead back down.'
      }
    ],
    anatomicalBenefits: [
      'Counteracts desk hunching by expanding thoracic chest volume',
      'Strengthens spinal extensor muscles along the entire vertebral column',
      'Stimulates abdominal organs and massages liver, pancreas, and kidneys',
      'Improves respiratory capacity and asthmatic breathing patterns'
    ],
    mentalBenefits: [
      'Alleviates chronic lethargy and boosts mental alertness',
      'Opens the emotional heart center to release trapped grief and fear',
      'Stimulates sympathetic and parasympathetic nervous balance'
    ],
    contraindications: [
      'Pregnancy after the first trimester',
      'Recent abdominal surgery or active hernia',
      'Severe carpal tunnel syndrome or acute lumbar disc herniation'
    ],
    breathingCue: 'Deep inhalation to lift thoracic chest; smooth exhalation while maintaining the gentle spinal arc.',
    drishti: 'Bhrumadhya (Third Eye space between eyebrows) or soft upward gaze',
    recommendedHold: '20 to 45 seconds',
    proTips: [
      'Do not crank your head back. Keep the cervical spine continuous with the natural curve of the mid-back.',
      'Keep elbows softly bent rather than locking them straight.'
    ],
    seoKeywords: [
      'bhujangasana steps benefits precautions',
      'cobra pose yoga tutorial',
      'bhujangasana for back pain',
      'hatha yoga backbends rishikesh',
      'cobra pose alignment benefits'
    ],
    faqs: [
      {
        question: 'Is Cobra Pose good for lower back pain?',
        answer: 'Yes, when practiced correctly with core engagement and thoracic extension, it strengthens back muscles and improves posture. However, avoid sharp compression into the lumbar spine.'
      },
      {
        question: 'What is the difference between Cobra Pose and Upward-Facing Dog?',
        answer: 'In Cobra Pose (Bhujangasana), hips and thighs remain on the mat with bent elbows. In Upward-Facing Dog (Urdhva Mukha Svanasana), thighs and knees are lifted entirely off the mat with straight arms.'
      }
    ]
  },

  {
    id: 'asana-3',
    sanskritName: 'Adho Mukha Svanasana',
    sanskritDevanagari: 'अधोमुखश्वानासन',
    englishName: 'Downward-Facing Dog',
    pronunciation: 'AH-doh MOO-kuh shvah-NAHS-uh-nuh',
    slug: 'adho-mukha-svanasana-downward-facing-dog',
    category: 'Inversions & Arm Balances',
    difficulty: 'Beginner',
    chakra: 'Ajna (Third Eye Chakra) & Sahasrara',
    element: 'Water (Jala) & Space (Akasha)',
    targetMuscles: ['Hamstrings', 'Gastrocnemius (Calves)', 'Latissimus Dorsi', 'Triceps', 'Rhomboids'],
    coverImage: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The quintessential inverted V-shape posture of modern and classical yoga that decompresses the lumbar spine and rejuvenates cerebral circulation.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tabletop Foundation',
        instruction: 'Start on hands and knees with wrists under shoulders and knees beneath hips. Spread your fingers wide and press through your index knuckles.'
      },
      {
        stepNumber: 2,
        title: 'Tuck Toes & Lift Hips',
        instruction: 'Tuck your toes under. On an exhalation, lift your knees away from the mat and send your sitting bones toward the sky.'
      },
      {
        stepNumber: 3,
        title: 'Lengthen the Spine',
        instruction: 'Press the floor away firmly with both hands. Lengthen from wrists all the way through your tailbone, keeping knees softly bent if hamstrings are tight.'
      },
      {
        stepNumber: 4,
        title: 'Ground the Heels',
        instruction: 'Slowly invite your heels toward the ground without forcing them flat. Rotate outer upper arms outward to create space around your neck.'
      },
      {
        stepNumber: 5,
        title: 'Sustain & Breathe',
        instruction: 'Relax your head between your biceps. Take 5 to 10 slow, resonant Ujjayi breaths before lowering into Child’s Pose.'
      }
    ],
    anatomicalBenefits: [
      'Deeply elongates the posterior chain: hamstrings, Achilles tendons, and calves',
      'Decompresses lumbar intervertebral discs through passive gravitational traction',
      'Builds bone density in wrists, arms, and shoulder girdle',
      'Increases blood flow to the head, nourishing scalp, facial skin, and brain'
    ],
    mentalBenefits: [
      'Calms an agitated mind and relieves mild chronic fatigue',
      'Combats brain fog by increasing cerebral oxygenation',
      'Acts as both an energizing inversion and a restorative resting pose'
    ],
    contraindications: [
      'Severe carpal tunnel syndrome (use yoga wedges or dolphin pose on forearms)',
      'Uncontrolled high blood pressure or eye conditions like glaucoma',
      'Late-term pregnancy'
    ],
    breathingCue: 'Slow, steady Ujjayi oceanic breathing with gentle navel contraction on the exhalation.',
    drishti: 'Nabhi (Navel point) or between the knees/feet',
    recommendedHold: '1 to 3 minutes',
    proTips: [
      'Prioritize a flat, elongated spine over forcing your heels flat on the mat. Bend your knees if needed.',
      'Distribute weight evenly into the pad of the index finger and thumb to protect wrists.'
    ],
    seoKeywords: [
      'adho mukha svanasana steps and benefits',
      'downward dog alignment guide',
      'how to do downward dog without wrist pain',
      'classical yoga poses rishikesh',
      'inversion yoga poses benefits'
    ],
    faqs: [
      {
        question: 'Do my heels have to touch the floor in Downward Dog?',
        answer: 'No. Having heels flat depends on ankle anatomy and Achilles tendon length. A straight, lengthened spine with bent knees is far more beneficial than flat heels with a rounded back.'
      },
      {
        question: 'Why is Downward Dog considered a mild inversion?',
        answer: 'Because your head rests below your heart, reversing gravity to facilitate venous blood return from lower limbs back to the heart and brain without the compression of a headstand.'
      }
    ]
  },

  {
    id: 'asana-4',
    sanskritName: 'Trikonasana',
    sanskritDevanagari: 'त्रिकोणासन',
    englishName: 'Extended Triangle Pose',
    pronunciation: 'trih-koh-NAH-suh-nuh',
    slug: 'trikonasana-extended-triangle-pose',
    category: 'Standing',
    difficulty: 'Beginner',
    chakra: 'Manipura (Solar Plexus) & Swadhisthana',
    element: 'Fire (Agni)',
    targetMuscles: ['Obliques', 'Hamstrings', 'Groin', 'Latissimus Dorsi', 'Psoas'],
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A dynamic standing triangle geometry that expands the thoracic ribs, stretches the lateral flanks, and activates the digestive fire of Manipura.',
    steps: [
      {
        stepNumber: 1,
        title: 'Wide Legged Stance',
        instruction: 'Stand on your mat with feet 3.5 to 4 feet apart. Turn your right foot outward 90 degrees and angle your left foot inward about 15 degrees.'
      },
      {
        stepNumber: 2,
        title: 'Extend Arms Horizontal',
        instruction: 'Inhale and bring your arms parallel to the floor, actively reaching outward through both sets of fingertips with palms facing down.'
      },
      {
        stepNumber: 3,
        title: 'Reach Forward Through Right Flank',
        instruction: 'Exhale and hinge directly at your right hip crease. Reach your right torso as far forward over your right leg as possible without collapsing.'
      },
      {
        stepNumber: 4,
        title: 'Hand Placement & Heart Stack',
        instruction: 'Rest your right hand lightly onto a block, shin, or ankle. Reach your left arm straight up toward the ceiling, stacking shoulders in one vertical plane.'
      },
      {
        stepNumber: 5,
        title: 'Gaze & Hold',
        instruction: 'Turn your head gently to gaze up at your top left thumb. Breathe deeply into the left ribs for 5 breaths, then rise up smoothly on an inhale and switch.'
      }
    ],
    anatomicalBenefits: [
      'Stretches and strengthens thighs, knees, ankles, and pelvic girdle',
      'Opens chest and shoulders, expanding ribcage for increased lung capacity',
      'Stimulates abdominal organs, enhancing peristalsis and digestion',
      'Relieves sciatica pain and mild scoliosis curvature'
    ],
    mentalBenefits: [
      'Sharpens concentration and bodily spatial awareness',
      'Instills a sense of multidirectional physical freedom and stability',
      'Relieves built-up stress across the neck and upper back'
    ],
    contraindications: [
      'Low blood pressure (avoid looking up; gaze downward at the front foot)',
      'Acute neck pain (keep head in neutral alignment looking forward)',
      'Migraine or diarrhea'
    ],
    breathingCue: 'Inhale to expand both side bodies equally; exhale to gently twist the chest upward toward the ceiling.',
    drishti: 'Angusthamadhya (Tip of top thumb) or forward at the horizon',
    recommendedHold: '30 to 60 seconds per side',
    proTips: [
      'Imagine your entire body is pressed between two panes of glass. Do not let your top hip or chest roll forward.',
      'Use a yoga block under the lower hand to keep your spine straight and avoid rounding.'
    ],
    seoKeywords: [
      'trikonasana steps and benefits',
      'triangle pose yoga alignment',
      'trikonasana benefits for digestion',
      'standing yoga poses rishikesh',
      'how to do triangle pose without pain'
    ],
    faqs: [
      {
        question: 'Should I touch the floor with my lower hand in Trikonasana?',
        answer: 'Only if your chest remains completely open and your spine remains elongated. For most practitioners, placing the hand on a yoga block or shin creates superior alignment.'
      },
      {
        question: 'What is the primary chakra activated in Trikonasana?',
        answer: 'The Manipura Chakra (Solar Plexus), associated with personal willpower, digestive vitality, and inner warmth.'
      }
    ]
  },

  {
    id: 'asana-5',
    sanskritName: 'Paschimottanasana',
    sanskritDevanagari: 'पश्चिमोत्तानासन',
    englishName: 'Seated Forward Bend',
    pronunciation: 'pah-shee-moh-tahn-AHS-uh-nuh',
    slug: 'paschimottanasana-seated-forward-bend',
    category: 'Seated & Forward Bends',
    difficulty: 'Intermediate',
    chakra: 'Swadhisthana (Sacral Chakra) & Muladhara',
    element: 'Water (Jala)',
    targetMuscles: ['Hamstrings', 'Erector Spinae', 'Gluteal Muscles', 'Calves', 'Latissimus Dorsi'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Praised in the Hatha Yoga Pradipika as the posture that awakens the dormant Kundalini by stretching the entire back side (Paschima) of the body.',
    steps: [
      {
        stepNumber: 1,
        title: 'Dandasana Starting Pose',
        instruction: 'Sit on your mat with legs extended straight in front of you. Flex your feet actively and pull sitting bones back with your hands to ground evenly.'
      },
      {
        stepNumber: 2,
        title: 'Lengthen Spine Inhalation',
        instruction: 'Inhale deeply and sweep both arms overhead, lifting out of the lower waist and creating maximum vertical length along your spine.'
      },
      {
        stepNumber: 3,
        title: 'Hinge from Hip Creases',
        instruction: 'Exhale and hinge forward from the hips, leading with your sternum. Keep your back flat as you reach for your shins, ankles, or outer feet.'
      },
      {
        stepNumber: 4,
        title: 'Hold the Feet or Strap',
        instruction: 'Take hold of your feet with hands or wrap a yoga strap around the balls of your feet. Keep elbows softly bent and shoulders relaxed away from ears.'
      },
      {
        stepNumber: 5,
        title: 'Surrender in the Breath',
        instruction: 'With each inhale, find micro-length through the crown of your head; with each exhale, surrender deeper into the forward fold for 8 to 12 breaths.'
      }
    ],
    anatomicalBenefits: [
      'Stretches the entire posterior chain from heels to the base of the skull',
      'Massages liver, kidneys, pancreas, and spleen, stimulating insulin production',
      'Improves circulation around spinal nerves, soothing lower back stiffness',
      'Tones abdominal muscles and reduces visceral belly fat'
    ],
    mentalBenefits: [
      'Induces profound parasympathetic nervous system relaxation (Pratyahara)',
      'Relieves mental burnout, chronic insomnia, and high anxiety',
      'Cultivates humility, inward reflection, and ego surrender'
    ],
    contraindications: [
      'Acute lumbar disc herniation (slip disc) or severe sciatica flare-ups',
      'Asthma attacks or severe respiratory infections during acute phases',
      'Pregnancy'
    ],
    breathingCue: 'Inhale to subtly elongate the sternum; exhale to deepen the fold from the navel down.',
    drishti: 'Padayoragrai (Tips of Toes) or closed eyes focusing on the third eye',
    recommendedHold: '1 to 3 minutes',
    proTips: [
      'Never force your forehead to touch your knees by hunching your upper back. Lengthen the front of your torso toward your toes.',
      'Sit on the edge of a folded blanket if your pelvis tends to tilt backward.'
    ],
    seoKeywords: [
      'paschimottanasana steps benefits contraindications',
      'seated forward bend yoga tutorial',
      'paschimottanasana for kundalini awakening',
      'hatha yoga pradipika asanas',
      'yoga for tight hamstrings rishikesh'
    ],
    faqs: [
      {
        question: 'Why is it called Paschimottanasana (West Stretch)?',
        answer: 'In classical yogic tradition, practitioners faced the rising morning sun in the East (Purva). Thus, the entire back side of the body was considered the "West" (Paschima).'
      },
      {
        question: 'Can I bend my knees if my hamstrings are tight?',
        answer: 'Yes! Bending your knees allows your pelvis to tilt forward properly, safeguarding your lumbar spine and preventing lower back strain.'
      }
    ]
  },

  {
    id: 'asana-6',
    sanskritName: 'Sirsasana',
    sanskritDevanagari: 'शीर्षासन',
    englishName: 'Headstand (King of Asanas)',
    pronunciation: 'sheer-SHAH-suh-nuh',
    slug: 'sirsasana-headstand-king-of-asanas',
    category: 'Inversions & Arm Balances',
    difficulty: 'Advanced',
    chakra: 'Sahasrara (Crown Chakra) & Ajna',
    element: 'Ether (Akasha)',
    targetMuscles: ['Shoulder Girdle', 'Triceps', 'Core Transverse Abdominis', 'Rhomboids', 'Cervical Stabilizers'],
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Regarded in traditional Hatha Yoga as the Raja (King) of all asanas, reversing arterial gravity to nourish the master pituitary and pineal endocrine glands.',
    steps: [
      {
        stepNumber: 1,
        title: 'Establish the Triangle Base',
        instruction: 'Kneel on your mat. Interlace your fingers snugly up to the webbing, creating an equilateral triangular foundation with your elbows shoulder-width apart.'
      },
      {
        stepNumber: 2,
        title: 'Crown Placement',
        instruction: 'Place the crown (Bregma) of your head onto the mat with the back of your skull nestled snugly into your cupped palms. Press down through forearms.'
      },
      {
        stepNumber: 3,
        title: 'Dolphin Walk Inward',
        instruction: 'Tuck toes and lift knees. Walk your feet slowly toward your face until your hips are stacked directly over your shoulders.'
      },
      {
        stepNumber: 4,
        title: 'Float Into Balance',
        instruction: 'Engage core and draw knees tightly into your chest. Find balance here first, then slowly and with control extend both legs vertically to the sky.'
      },
      {
        stepNumber: 5,
        title: 'Hold & Gentle Child’s Pose',
        instruction: 'Press 80% of weight through forearms and shoulders, keeping neck light. Hold for 10 to 25 slow breaths, descend with control, and rest in Balasana.'
      }
    ],
    anatomicalBenefits: [
      'Dramatically improves arterial blood perfusion to the brain, pituitary, and pineal glands',
      'Reverses stagnant lymphatic pooling and venous blood in legs, relieving varicose veins',
      'Builds extraordinary core, shoulder, and upper back structural strength',
      'Aids digestion by relieving gravitational compression on lower intestinal tracts'
    ],
    mentalBenefits: [
      'Overcomes fear and cultivates supreme mental clarity and razor-sharp concentration',
      'Balances the endocrine hormones governing mood, sleep, and emotional rhythm',
      'Induces a tranquil, serene meditative mental state post-practice'
    ],
    contraindications: [
      'Cervical spine issues, herniated discs, or neck injuries',
      'High blood pressure, heart disease, or history of stroke',
      'Eye conditions such as detached retina or severe glaucoma',
      'Menstruation or pregnancy'
    ],
    breathingCue: 'Slow, calm, rhythmic nasal breathing without holding breath (Kumbhaka is only for advanced masters).',
    drishti: 'Nasagrai (Tip of Nose) or closed eyes centered on Sahasrara',
    recommendedHold: '1 to 5 minutes (build gradually under teacher supervision)',
    proTips: [
      'Eighty percent of your body weight must remain grounded through your forearms and shoulders. Do not compress your cervical neck vertebrae.',
      'Always rest in Balasana (Child’s Pose) for at least 6 to 8 breaths immediately after descending to stabilize blood pressure.'
    ],
    seoKeywords: [
      'sirsasana steps and benefits precautions',
      'headstand yoga alignment tutorial',
      'king of asanas benefits',
      'sirsasana for brain health and endocrine system',
      'advanced yoga teacher training rishikesh headstand'
    ],
    faqs: [
      {
        question: 'Can I learn Headstand on my own at home?',
        answer: 'We strongly advise learning Headstand under the direct eye-to-eye supervision of an accredited Yoga Alliance instructor in an ashram setting to master wrist-shoulder mechanics without neck risk.'
      },
      {
        question: 'Why should I rest in Child’s Pose immediately after Sirsasana?',
        answer: 'Resting in Child’s Pose allows the sudden shift in cerebral arterial blood pressure to normalize smoothly, preventing dizziness, headaches, or fainting.'
      }
    ]
  },

  {
    id: 'asana-7',
    sanskritName: 'Balasana',
    sanskritDevanagari: 'बालासन',
    englishName: 'Child’s Pose',
    pronunciation: 'bah-LAH-suh-nuh',
    slug: 'balasana-childs-pose',
    category: 'Restorative & Gentle',
    difficulty: 'Beginner',
    chakra: 'Ajna (Third Eye Chakra) & Muladhara',
    element: 'Earth (Prithvi)',
    targetMuscles: ['Gluteus Medius', 'Spinal Extensors', 'Ankle Dorsiflexors', 'Latissimus Dorsi'],
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The ultimate sacred refuge posture in yoga, surrendering the frontal brain to the earth to activate the parasympathetic nervous system and soothe the mind.',
    steps: [
      {
        stepNumber: 1,
        title: 'Kneeling Alignment',
        instruction: 'Kneel on your mat. Bring your big toes together to touch and separate your knees wide toward the outer edges of the mat (or keep knees together for lower back stretch).'
      },
      {
        stepNumber: 2,
        title: 'Hips to Heels',
        instruction: 'Sink your hips back onto your heels. If your buttocks do not comfortably touch your heels, place a folded blanket between thighs and calves.'
      },
      {
        stepNumber: 3,
        title: 'Fold Forward',
        instruction: 'Exhale and drape your torso down between your thighs, resting your forehead softly onto the mat or a block.'
      },
      {
        stepNumber: 4,
        title: 'Arm Options',
        instruction: 'Extend your arms forward with palms down for active shoulder release, or rest arms back alongside your torso with palms facing up for full relaxation.'
      },
      {
        stepNumber: 5,
        title: 'Rest & Surrender',
        instruction: 'Breathe deeply into the back of your lungs, feeling your ribs expand three-dimensionally. Stay for 1 to 5 minutes as needed.'
      }
    ],
    anatomicalBenefits: [
      'Gently releases tension across hips, thighs, and ankles',
      'Decompresses lumbar spine and eases lower back stiffness',
      'Relieves tension in shoulders, neck, and chest'
    ],
    mentalBenefits: [
      'Triggers the rest-and-digest response, rapidly decreasing cortisol levels',
      'Grounds panic, anxiety, and sensory overload into the earth',
      'Provides a safe physical sanctuary during demanding yoga practices'
    ],
    contraindications: [
      'Severe knee injuries or acute osteoarthritis',
      'Active diarrhea or stomach infection'
    ],
    breathingCue: 'Slow, expansive diaphragmatic breathing that lifts and broadens the posterior ribcage on every inhale.',
    drishti: 'Third Eye point grounded into the earth (internal gaze)',
    recommendedHold: '1 to 5 minutes',
    proTips: [
      'Place a bolster or pillow under your torso for deep restorative comfort.',
      'Gently rock your forehead side-to-side on the mat to massage your third eye and relieve tension headaches.'
    ],
    seoKeywords: [
      'balasana childs pose steps benefits',
      'restorative yoga childs pose',
      'balasana for anxiety and stress relief',
      'gentle yoga poses rishikesh',
      'childs pose alignment guide'
    ],
    faqs: [
      {
        question: 'When should I take Child’s Pose during a yoga class?',
        answer: 'Anytime you feel breathless, fatigued, or emotionally overwhelmed. It is an open invitation from your practice to rest, honor your body, and reset your breathing.'
      },
      {
        question: 'What if my knees hurt in Child’s Pose?',
        answer: 'Place a rolled-up towel behind your knee creases to create space in the joint, or place a cushion beneath your hips.'
      }
    ]
  },

  {
    id: 'asana-8',
    sanskritName: 'Surya Namaskar',
    sanskritDevanagari: 'सूर्यनमस्कार',
    englishName: 'Sun Salutation (12 Classical Asana Flow)',
    pronunciation: 'SOOR-yuh nah-muh-SKAR',
    slug: 'surya-namaskar-classical-sun-salutation',
    category: 'Standing',
    difficulty: 'Beginner',
    chakra: 'Manipura (Solar Plexus) & All 7 Chakras',
    element: 'Sun Energy (Pingala Nadi)',
    targetMuscles: ['Full Body Integration', 'Core', 'Hamstrings', 'Chest', 'Quadriceps', 'Shoulders'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The ancient 12-step Vedic vinyasa prayer of movement and breath honoring the solar source of all prana, awakening cellular vitality and balancing all doshas.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pranamasana (Prayer Pose)',
        instruction: 'Stand at the front of your mat in Tadasana. Bring palms together in front of chest in prayer. Exhale completely, connecting with solar energy.'
      },
      {
        stepNumber: 2,
        title: 'Hasta Uttanasana (Raised Arms Pose)',
        instruction: 'Inhale and lift both arms overhead. Arch back gently from the thoracic spine while keeping biceps close to ears.'
      },
      {
        stepNumber: 3,
        title: 'Uttanasana (Standing Forward Bend)',
        instruction: 'Exhale and hinge forward from hips. Bring palms to floor beside feet, drawing head toward knees.'
      },
      {
        stepNumber: 4,
        title: 'Ashwa Sanchalanasana (Equestrian Pose)',
        instruction: 'Inhale and step your right leg back into a deep lunge. Lower right knee to mat, open chest, and gaze upward.'
      },
      {
        stepNumber: 5,
        title: 'Dandasana (Plank Pose)',
        instruction: 'Retain the breath and step left leg back beside right. Form a straight line from heels to crown in strong plank.'
      },
      {
        stepNumber: 6,
        title: 'Ashtanga Namaskara (Eight-Limbed Salutation)',
        instruction: 'Exhale and lower knees, chest, and chin to floor. Keep hips slightly elevated (eight points touching mat).'
      },
      {
        stepNumber: 7,
        title: 'Bhujangasana (Cobra Pose)',
        instruction: 'Inhale and slide forward, lifting chest into Cobra with elbows bent and shoulders rolling back.'
      },
      {
        stepNumber: 8,
        title: 'Adho Mukha Svanasana (Downward Dog)',
        instruction: 'Exhale, tuck toes, and press hips back and up into an inverted V-shape.'
      },
      {
        stepNumber: 9,
        title: 'Ashwa Sanchalanasana (Equestrian Pose)',
        instruction: 'Inhale and step right foot forward between hands. Lower left knee, open chest, and gaze upward.'
      },
      {
        stepNumber: 10,
        title: 'Uttanasana (Standing Forward Bend)',
        instruction: 'Exhale and step left foot forward beside right. Fold deeply over legs.'
      },
      {
        stepNumber: 11,
        title: 'Hasta Uttanasana (Raised Arms Pose)',
        instruction: 'Inhale, sweep arms overhead, and gently arch backward.'
      },
      {
        stepNumber: 12,
        title: 'Pranamasana (Prayer Pose)',
        instruction: 'Exhale and bring palms back to heart center. Rest and observe the flow of Prana.'
      }
    ],
    anatomicalBenefits: [
      'Comprehensive cardiovascular warm-up stimulating all 12 body systems',
      'Increases spinal flexibility and strengthens abdominal, arm, and leg muscles',
      'Enhances lymphatic circulation and speeds metabolic cellular detox',
      'Normalizes hormonal balance by stimulating thyroid, adrenal, and pituitary glands'
    ],
    mentalBenefits: [
      'Ignites physical energy and dispels morning sluggishness (Tamas)',
      'Synchronizes breath and movement, inducing dynamic mindfulness',
      'Fosters deep reverence for cosmic solar energy and circadian rhythm'
    ],
    contraindications: [
      'Severe spinal injuries or acute disc herniation',
      'High blood pressure or heart ailments (practice slowly without fast breath retention)',
      'Wrist injuries (modify step 5 and 8)'
    ],
    breathingCue: 'Strict Vedic synchronization: Inhale on expansions and backbends; exhale on contractions and forward bends.',
    drishti: 'Alternates between Third Eye, Sky, and Navel matching the 12 steps',
    recommendedHold: 'Perform 3 to 12 rounds in the morning at sunrise',
    proTips: [
      'Face East at dawn for maximum energetic and pranic benefit.',
      'Chant traditional solar mantras (Om Mitraya Namaha, Om Ravaye Namaha...) for deeper vibrational resonance.'
    ],
    seoKeywords: [
      'surya namaskar 12 steps benefits with pictures',
      'sun salutation sequence guide',
      'how to do surya namaskar for weight loss and energy',
      'classical hatha yoga surya namaskar rishikesh',
      'morning yoga sequence 12 poses'
    ],
    faqs: [
      {
        question: 'How many rounds of Surya Namaskar should beginners do?',
        answer: 'Beginners should start with 3 to 6 rounds (each round consists of two sets: right leg leading and left leg leading) and gradually increase to 12 rounds as endurance builds.'
      },
      {
        question: 'What is the best time to practice Sun Salutations?',
        answer: 'Early morning during Brahma Muhurta (around dawn) on an empty stomach is the ideal time to synchronize your body’s biorhythms with natural sunlight.'
      }
    ]
  }
];
