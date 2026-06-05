/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, UserProfile } from './types';

export const ALL_TOPICS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Systems',
  'Cybersecurity',
  'Software Systems',
  'Robotics',
  'Microelectronics',
  'Signal Processing',
  'Tissue Engineering',
  'Synthetic Biology',
  'Genetic Editing',
  'Thermodynamics',
  'Fluid Mechanics',
  'Vehicle Design',
  'Sustainable Materials',
  'Structural Health',
  'Water Resources',
  'Aerodynamics',
  'Propulsion Systems',
  'Orbital Mechanics',
  'Cognitive Psychology',
  'Clinical Psychiatry',
  'Neuropsychology',
  'Sociology & Economics',
  'Clinical Medicine',
  'Pharmacology',
  'Oncology',
  'Public Health',
  'Medical Imaging',
  'Biomaterials',
  'Biomechanics',
  'Materials Science',
  'Quantum Physics',
  'Organic Chemistry'
];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Morgan',
  bio: 'Lead researcher and platform curator. Exploring the intersection of digital architecture and minimal interface design.',
  email: 'curator@zid.hub',
  handle: 'curator_alpha',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  githubConnected: true,
  githubUsername: 'zid-developer',
  level: 12,
  exp: 820,
  maxExp: 1000,
  selectedTopics: ['Artificial Intelligence', 'Machine Learning', 'Cybersecurity'],
  badges: ['Level 12 Architect', 'Research Fellow', 'Verified Compiler'],
  joinedDate: 'May 2026',
  stats: {
    contributions: 412,
    streak: 35,
    articlesRead: 194,
    reposSynced: 18
  }
};

// Helper to create beautiful scientific articles easily
export function createArticle(
  id: string,
  title: string,
  excerpt: string,
  category: string,
  imageUrl: string,
  readTime = '5 min read',
  likes = 120
): Article {
  return {
    id,
    title,
    excerpt,
    category,
    readTime,
    publishedAt: 'May 2026',
    likes,
    isBookmarked: false,
    imageUrl,
    author: {
      name: 'Dr. Evelyn Moss',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      role: 'ZID Core Researcher'
    },
    content: `## ${title} - A Technical Analysis
In contemporary industrial circles, the convergence of advanced computing and physical engineering is enabling a massive transformation. This documentation analyzes key variables, methodology models, and implementation structures.

### Research Methodology & Setup
Our teams configured clean channels to cast rich, high-fidelity real-time data onto processing frameworks. Rather than treating hardware as static nodes, we model them as active state controllers:

* **Signal Noise Ratio (SNR) Optimization:** Achieved using adaptive Kalman filters and localized RF shield matrices.
* **Consensus Models:** Structured via zero-latency replication streams backboned on decentralized ledger grids.
* **Integrity Validation:** Monitored dynamically using lightweight hash proofs computed at the chip boundary level.

### Implementation Guidelines
1. Ensure the execution environment holds standard safety boundary constraints before initiating hot compilation.
2. Initialize memory rings cleanly to avoid leaking stack parameters into external bus buffers.
3. Keep the telemetry loop independent from the main computation queue to prevent signal starvation or deadlocks.

"True structural performance is not about command-line speed, but rather the formal proof of deterministic state pathways under chaotic external stresses."`
  };
}

// Sub-topic mapping structure
export interface SubTopicData {
  name: string;
  featuredArticle: Article;
  carouselArticles: Article[];
}

export const KNOWLEDGE_HUB_DATA: Record<string, SubTopicData[]> = {
  'Computer Sciences': [
    {
      name: 'Artificial Intelligence',
      featuredArticle: createArticle(
        'ai-feat',
        'Reimagining Intelligence: Cog Transformers and Causal Deduction Matrices',
        'Causal Transformers represent a spectacular paradigm shift in autonomous decision systems, integrating memory layers with formal logic deduction grids.',
        'Computer Sciences',
        'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
        '8 min read',
        520
      ),
      carouselArticles: [
        createArticle('ai-c1', 'Neural Architecture Search at Scale with PPO Agents', 'How automated evolutionary searches are creating ultra-dense models without human labels.', 'Computer Sciences', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('ai-c2', 'Causal Inference Matrices in Natural Selection Simulations', 'Bypassing surface correlations to mathematically guarantee model alignment vectors.', 'Computer Sciences', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600', '4 min read'),
        createArticle('ai-c3', 'Ethics in Generative RLHF and Adversarial Token Poisoning', 'Guarding deep reinforcement layers against complex prompt hijacking and toxic fine-tuning.', 'Computer Sciences', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600', '7 min read')
      ]
    },
    {
      name: 'Machine Learning',
      featuredArticle: createArticle(
        'ml-feat',
        'Unsupervised Meta-Learning and Self-Directed Loss Function Refinement',
        'Exploring next-generation gradient descent engines that dynamically re-engineer their own training goals based on parameter entropy spikes.',
        'Computer Sciences',
        'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800',
        '6 min read',
        410
      ),
      carouselArticles: [
        createArticle('ml-c1', 'Diffusion Models and Geometric Topology Constraints', 'Mapping continuous visual outputs into dense hyper-dimensional mathematical shapes.', 'Computer Sciences', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('ml-c2', 'Vector DBMS Quantization Hacks: Product vs. Scalar', 'A performance audit of extreme-scale semantic searches holding exabyte-grade datasets.', 'Computer Sciences', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('ml-c3', 'Sparsification on Edge: Quantizing to Int4 without Loss', 'A critical review of custom compiler mappings on micro-watt embedded silicon platforms.', 'Computer Sciences', 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=600', '4 min read')
      ]
    },
    {
      name: 'Data',
      featuredArticle: createArticle(
        'data-feat',
        'Distributed Stream Routing at Exabyte Scales with Zero Latency Consensus',
        'How modern high-throughput streaming pipelines use adaptive ring-buffers and lock-free memory structures to process millions of ticks per second.',
        'Computer Sciences',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        '7 min read',
        380
      ),
      carouselArticles: [
        createArticle('data-c1', 'Differential Privacy Models in Multi-Tenant SQL Databases', 'Ensuring absolute database integrity while serving sparse data pools to third parties.', 'Computer Sciences', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('data-c2', 'Graph Theories Applied to Real-Time Social Routing Networks', 'Analyzing critical cycle loops and bottlenecks on huge localized distributed schemas.', 'Computer Sciences', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('data-c3', 'Columnar Database Compression Paradigms: An Audit', 'Reviewing standard LZ4 versus specialized run-length encodings on high-frequency indices.', 'Computer Sciences', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600', '6 min read')
      ]
    },
    {
      name: 'Cybersecurity',
      featuredArticle: createArticle(
        'sec-feat',
        'Zero-Trust Cryptography Models inside Post-Shor Computation Networks',
        'Preparing system layers for the quantum era using lattice-based cryptosystems and multi-party decentralized verification lattices.',
        'Computer Sciences',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        '9 min read',
        490
      ),
      carouselArticles: [
        createArticle('sec-c1', 'Automated Fuzzing of Linux Kernels Using LLMs in Sandboxes', 'Finding zero-day kernel vulnerabilities through guided semantic input generators.', 'Computer Sciences', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600', '8 min read'),
        createArticle('sec-c2', 'Bypassing CPU Hardware Enclave Isolation Attestation', 'A review of side-channel transients targeting specialized secure silicon walls.', 'Computer Sciences', 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('sec-c3', 'Microservices Threat Mapping: RPC Protocol Hijacking Secrets', 'Hardening gRPC and REST pipelines in modern cloud-native Kubernetes grids.', 'Computer Sciences', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    },
    {
      name: 'Software',
      featuredArticle: createArticle(
        'soft-feat',
        'Monadic Execution Frameworks and Compilation Protocols in Web Architecture',
        'Structuring web servers using mathematically proven functional types to construct robust, zero-crash application services under massive concurrency.',
        'Computer Sciences',
        'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800',
        '10 min read',
        640
      ),
      carouselArticles: [
        createArticle('soft-c1', 'Garbage Collection Schedulers: High Frequency Optimizations', 'Minimizing frame dropping on massive multi-threaded distributed runtime loops.', 'Computer Sciences', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600', '7 min read'),
        createArticle('soft-c2', 'WebAssembly: Running Complex C++ Physics directly in the Browser', 'Bypassing interpreter limits to implement extreme calculations right inside clients.', 'Computer Sciences', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('soft-c3', 'Compiler Code Elimination Hacks for Heterogeneous Chips', 'Optimizing static code sizing to fit securely inside hyper-limited CPU Cache layers.', 'Computer Sciences', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Electrical': [
    {
      name: 'Robotics',
      featuredArticle: createArticle(
        'rob-feat',
        'Tactile Feedback Integration & Sensory Array Synthesis in Robotic Limbs',
        'Interfacing bio-mimetic sensor rings with micro-second control controllers to allow flawless manipulation of delicate organic objects.',
        'Electrical',
        'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
        '7 min read',
        312
      ),
      carouselArticles: [
        createArticle('rob-c1', 'Dynamic Gait Mapping for Quadruped Terrains', 'Mathematical models to prevent system tipping on high-slope muddy fields.', 'Electrical', 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('rob-c2', 'Simultaneous Localization and Mapping on Low-Res Monocular Video', 'Running real-time visual-inertial SLAM inside tiny autonomous drone processors.', 'Electrical', 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('rob-c3', 'Direct-Drive Actuators: Resolving Hysteresis and Torque Ripples', 'Optimizing electromagnetic stator spacing to ensure absolute precise degree positioning.', 'Electrical', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600', '7 min read')
      ]
    },
    {
      name: 'Microelectronics',
      featuredArticle: createArticle(
        'micro-feat',
        'Sub-3nm Lithography Challenges: Power Dissipation & Quantum Tunneling Barriers',
        'How silicon foundries are managing electrical leakage and parasitic gate capacitance through GAA-FET designs and atomic layer insulation.',
        'Electrical',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        '9 min read',
        289
      ),
      carouselArticles: [
        createArticle('micro-c1', 'High-Bandwidth Memory (HBM3) Silicon Interposers', 'Managing massive interconnect traces to connect CPU cores and rapid VRAM pools.', 'Electrical', 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('micro-c2', 'Gallium Nitride (GaN) Semiconductors for High-Power Switching', 'Achieving 99% conversion efficiency in compact, light high-frequency DC networks.', 'Electrical', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('micro-c3', 'Asynchronous IC Architectures: Eliminating Global System Clocks', 'Bypassing clock-skew issues by using handshaking logic rings on wafer designs.', 'Electrical', 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600', '6 min read')
      ]
    },
    {
      name: 'Signal Processing',
      featuredArticle: createArticle(
        'sig-feat',
        'Dynamic Equalization in Multi-Carrier 6G Waveform Propagation',
        'Combating atmospheric scattering and multi-path fading in high GHz frequencies using fast Fourier transforms and real-time antenna tracking matrices.',
        'Electrical',
        'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
        '6 min read',
        220
      ),
      carouselArticles: [
        createArticle('sig-c1', 'Wavelet Transform Matrices for Ultra-Low Noise ECG Filters', 'Filtering heart monitor ripples without introducing signal propagation distortion.', 'Electrical', 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('sig-c2', 'Real-Time Holographic Spatial Mapping using LiDAR Array Returns', 'Processing spherical point cloud signals inside low-footprint DSP units.', 'Electrical', 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('sig-c3', 'Hardware Accelerator Designs for 1D Iterative Convolution Layers', 'Mapping FIR filtering logic blocks directly into dedicated logic hardware gates.', 'Electrical', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Bioengineering': [
    {
      name: 'Tissue Engineering',
      featuredArticle: createArticle(
        'tissue-feat',
        '3D Bio-Printing Techniques for Artificial Scaffold Vascularization',
        'Overcoming the critical nutrient-diffusion barrier by embedding vascular microtubes direkt into biopolymer hydrogels during cellular layering.',
        'Bioengineering',
        'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800',
        '8 min read',
        340
      ),
      carouselArticles: [
        createArticle('tissue-c1', 'Decellularized Mammalian Scaffold Re-Seeding Mechanics', 'Rebuilding functional organ shapes by populating donor skeletons with fresh user stem cells.', 'Bioengineering', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('tissue-c2', 'Hydrogel Mechanical Properties under Periodic Stress Matrices', 'Ensuring printed structures hold their shape under standard human movement triggers.', 'Bioengineering', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('tissue-c3', 'Stem Cell Stemness Variables in Electrospun Fibers', 'Encouraging self-renewal by matching fiber thickness to organic collagen spacing.', 'Bioengineering', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600', '4 min read')
      ]
    },
    {
      name: 'Synthetic Biology',
      featuredArticle: createArticle(
        'syn-feat',
        'Metabolic Assembly Pathway Optimization using CRISPR dCas9 Repressors',
        'Programming genetic logic gates to dynamically regulate cellular fuel channels, boosting chemical synthesis rates inside industrial yeast crops.',
        'Bioengineering',
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
        '7 min read',
        390
      ),
      carouselArticles: [
        createArticle('syn-c1', 'De Novo Genome Synthesis: Assembly Strategies', 'Building comprehensive yeast chromosomes from scratch using automated ligases.', 'Bioengineering', 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('syn-c2', 'In Silico Protein Design Models for Enzymatic Catalysis Boosts', 'Designing brand new amino acid models using deep learning visual energy calculators.', 'Bioengineering', 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('syn-c3', 'Self-Assembling Peptide Scaffolds for Neural Axon Guidance', 'Creating nanoscale trails that encourage brain tissue regrowth after physical shock events.', 'Bioengineering', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Mechanical': [
    {
      name: 'Thermodynamics',
      featuredArticle: createArticle(
        'thermo-feat',
        'Supercritical CO2 Power Cycles: Enhancing Generation Yields',
        'Replacing standard water steam lines with rich supercritical carbon dioxide to build extremely compact, high-efficiency system loops.',
        'Mechanical',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
        '8 min read',
        185
      ),
      carouselArticles: [
        createArticle('thermo-c1', 'Thermal Insulation Strategies for Cryogenic Tanks', 'Minimizing gas boil-off in rocket fuel silos using layered silver reflecting papers.', 'Mechanical', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('thermo-c2', 'Phase-Change Material Synthesis for Dynamic Building Claddings', 'Buffering interior room heat curves by embedding paraffin micro-droplets in masonry block structures.', 'Mechanical', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('thermo-c3', 'Entropy Audit in Metal Sintering Additive Printing Loops', 'Analyzing crystal grain boundary defects triggered by local laser heating variables.', 'Mechanical', 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Civil': [
    {
      name: 'Sustainable materials',
      featuredArticle: createArticle(
        'civ-feat',
        'Carbon-Negative Concrete Composites: Graphene reinforcement mechanics',
        'Disrupting the building industry by binding calcium silicates with trapped industrial biochar and graphene dust to achieve extreme load performance.',
        'Civil',
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
        '6 min read',
        210
      ),
      carouselArticles: [
        createArticle('civ-c1', 'Mycelium Block Synthesis: Organic Bricks', 'Growing load-bearing insulation bricks using agricultural waste and active fungus grids.', 'Civil', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('civ-c2', 'Dynamic Tensile Audits of Self-Healing Bacterial Concrete', 'Using limestone-secreting bacteria to repair fine cement cracks autonomously.', 'Civil', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('civ-c3', 'Cross-Laminated Timber: High-Rise Structural Integrity', 'Mapping fire-resistance and shear limits of thick multi-layered renewable spruce columns.', 'Civil', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600', '6 min read')
      ]
    }
  ],
  'Aerospace': [
    {
      name: 'Aerodynamics',
      featuredArticle: createArticle(
        'aero-feat',
        'Laminar Flow Optimization on Hypersonic Airfoils at Mach 5+',
        'Managing extreme shock waves and boundary layer separation using plasma actuator grids and hyper-swept metallic alloy wings.',
        'Aerospace',
        'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
        '8 min read',
        290
      ),
      carouselArticles: [
        createArticle('aero-c1', 'Active Flow Control via Micro-Jets', 'Eliminating physical flaps by venting high-pressure bypass streams directly through wing skins.', 'Aerospace', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('aero-c2', 'Vortex Breakdown Dynamics in Swept-Wing Transonic Loops', 'Improving aircraft roll authority during tight high-G landing maneuvers.', 'Aerospace', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('aero-c3', 'Rarefied Gas Atmospheric Flight above 80km Altitudes', 'Aerodynamic modeling in near-vacuum zones using direct simulation Monte Carlo meshes.', 'Aerospace', 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=600', '7 min read')
      ]
    }
  ],
  'Psychology': [
    {
      name: 'Cognitive & Behavioral Psychology',
      featuredArticle: createArticle(
        'psy-feat',
        'Attention Starvation and Cognitive Loop Interventions in Digital Environments',
        'An executive audit of how constant notification streams hijack dopamine release curves, with practical strategies to rebuild deep focus thresholds.',
        'Psychology',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        '6 min read',
        301
      ),
      carouselArticles: [
        createArticle('psy-c1', 'Working Memory Allocation under Task-Switching Demands', 'Measuring cognitive penances on professionals juggling diverse slack and terminal screens.', 'Psychology', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('psy-c2', 'Neuroplastic Interventions for Stress-Induced Cortisol Levels', 'Dynamic habit designs that stimulate vagus nerve responses and ease anxiety systems.', 'Psychology', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=600', '4 min read'),
        createArticle('psy-c3', 'Framing Bias in Multi-Agent Collaborative Taskboards', 'How presentation sequencing alters collective risk taking in venture development pools.', 'Psychology', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Health and Medical Sciences': [
    {
      name: 'Clinical Medicine',
      featuredArticle: createArticle(
        'med-feat',
        'Monoclonal Antibody Customization in Patient-Specific Immune Cells',
        'A clinical study highlighting how genetic tailoring of target-seeking antibodies improves selective cancer eradication rates while saving healthy organs.',
        'Health and Medical Sciences',
        'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
        '7 min read',
        412
      ),
      carouselArticles: [
        createArticle('med-c1', 'Continuous Glucose Monitors: Subcutaneous Enzyme Metrics', 'Improving sensor lifespans by mitigating tissue encapsulation with custom polymer layers.', 'Health and Medical Sciences', 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('med-c2', 'Proton Beam Radiotherapy Precision Mapping for Deep Tumors', 'Minimizing damage to sensitive healthy tissues using magnetic beam collimators.', 'Health and Medical Sciences', 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('med-c3', 'Microbiome Compositions and Systemic Inflammatory Markers', 'Direct correlations between intestinal flora richness and cardiovascular vascular health.', 'Health and Medical Sciences', 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=600', '6 min read')
      ]
    }
  ],
  'Biomedical': [
    {
      name: 'Medical Imaging',
      featuredArticle: createArticle(
        'biomed-feat',
        'Ultra-High-Field 7T MRI Scanner Designs: Resolution Frontiers',
        'Pushing voxel resolution down to 100 microns to explore early-stage Alzheimer’s plaques without using invasive surgical methods.',
        'Biomedical',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        '7 min read',
        235
      ),
      carouselArticles: [
        createArticle('biomed-c1', 'Deep Convolutional Networks for Tumorous Nodule Segmentations', 'Deploying neural classifiers to circle early cancerous cells on high-speed CT scans.', 'Biomedical', 'https://images.unsplash.com/photo-1526253038957-bea54e381d8c?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('biomed-c2', 'Photoacoustic Tomography and Real-Time Blood Flow Visualizer', 'Blending laser-induced sound waves with ultrasound to map capillaries dynamically.', 'Biomedical', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('biomed-c3', 'Contrast Agents: Gadolinium Retention and Safer Alternatives', 'Developing biocompatible iron oxide nano-crystals that clear user kidneys within hours.', 'Biomedical', 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=600', '5 min read')
      ]
    }
  ],
  'Physics and Chemistry': [
    {
      name: 'Materials Science',
      featuredArticle: createArticle(
        'phys-feat',
        'Room-Temperature Superconductivity in Polymer Carbon Hydrides',
        'Reviewing atomic lattice stability and extreme compression requirements (2.5 Mbar) in novel molecular crystals to enable lossless grid lines.',
        'Physics and Chemistry',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800',
        '8 min read',
        408
      ),
      carouselArticles: [
        createArticle('phys-c1', 'MXenes: High-Performance 2D Nanomaterials for Micro-Supercapacitors', 'Achieving energy densities comparable to status batteries utilizing organic titanium sheets.', 'Physics and Chemistry', 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&q=80&w=600', '5 min read'),
        createArticle('phys-c2', 'Perovskite Solar Cells: Passivating Defect Sites via Organic Salts', 'Boosting light harvesting conversion ceilings up to 26.2% in solar cell film layouts.', 'Physics and Chemistry', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600', '6 min read'),
        createArticle('phys-c3', 'Single-Atom Catalysts on Nanofibrous Cobalt Scaffolds', 'Accelerating hydrogen fuel synthesis rates while cutting precious platinum requirements to zero.', 'Physics and Chemistry', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600', '6 min read')
      ]
    }
  ]
};

// Flatten mock database to populate normal feeds, search filters, and saving actions
export const MOCK_ARTICLES: Article[] = Object.values(KNOWLEDGE_HUB_DATA).flatMap(subTopics => {
  return subTopics.flatMap(st => [st.featuredArticle, ...st.carouselArticles]);
});
