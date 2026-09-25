const mongoose = require('mongoose');
const Course = require('./models/Course');
const Puzzle = require('./models/Puzzle');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-platform')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const courses = [
  {
    title: 'Chess Fundamentals - From Zero to Hero',
    description: 'Master the absolute basics of chess. Learn piece movement, special moves, checkmate patterns, and essential principles that every player needs to know.',
    category: 'foundations',
    level: 'beginner',
    difficulty: 1,
    instructor: 'Grandmaster Academy',
    duration: '4 hours',
    lessons: [
      {
        title: 'Setting Up the Board and Piece Movement',
        content: 'Learn how to properly set up a chess board and understand how each piece moves. The board has 64 squares alternating between light and dark colors. Each player starts with 16 pieces: one king, one queen, two rooks, two bishops, two knights, and eight pawns.',
        duration: '30 minutes',
        order: 1
      },
      {
        title: 'Special Moves: Castling, En Passant, and Promotion',
        content: 'Master the three special moves in chess. Castling is a king safety move that involves the king and a rook. En passant is a special pawn capture. Promotion occurs when a pawn reaches the opposite end of the board.',
        duration: '45 minutes',
        order: 2
      },
      {
        title: 'Check, Checkmate, and Stalemate',
        content: 'Understand the difference between check, checkmate, and stalemate. Check means your king is under attack. Checkmate means the game is over. Stalemate is a draw when the player has no legal moves.',
        duration: '40 minutes',
        order: 3
      },
      {
        title: 'Basic Checkmate Patterns',
        content: 'Learn fundamental checkmate patterns including two rooks mate, queen and king mate, and other essential mating patterns that every beginner should know.',
        duration: '45 minutes',
        order: 4
      },
      {
        title: 'Opening Principles',
        content: 'Master the three golden rules of openings: control the center, develop your pieces, and ensure king safety. These principles will guide your opening play and help you avoid common mistakes.',
        duration: '50 minutes',
        order: 5
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
    rating: 4.8
  },
  {
    title: 'Tactical Mastery - Forks, Pins, and Skewers',
    description: 'Develop your tactical vision by learning the most common tactical motifs. This course covers forks, pins, skewers, discovered attacks, and more with hundreds of examples.',
    category: 'tactics',
    level: 'beginner',
    difficulty: 2,
    instructor: 'Tactical Training Institute',
    duration: '6 hours',
    lessons: [
      {
        title: 'Introduction to Chess Tactics',
        content: 'Tactics are short-term calculations that lead to concrete advantages. Understanding tactical patterns is essential for chess improvement. This lesson introduces the concept of tactics and why they matter.',
        duration: '30 minutes',
        order: 1
      },
      {
        title: 'The Fork - Attacking Two Pieces at Once',
        content: 'A fork is a tactic where one piece attacks two or more enemy pieces simultaneously. Knights are especially dangerous at forking due to their unique L-shaped movement. Learn to spot and execute forks.',
        duration: '45 minutes',
        order: 2
      },
      {
        title: 'Pins - Restricting Enemy Movement',
        content: 'A pin occurs when a piece cannot move because it would expose a more valuable piece behind it to attack. Absolute pins pin a piece to the king, while relative pins pin to other valuable pieces.',
        duration: '50 minutes',
        order: 3
      },
      {
        title: 'Skewers - The Reverse Pin',
        content: 'A skewer is similar to a pin but reversed - it attacks a valuable piece that must move, exposing a less valuable piece behind it. This is particularly effective with queens and rooks.',
        duration: '40 minutes',
        order: 4
      },
      {
        title: 'Discovered Attacks and Checks',
        content: 'A discovered attack occurs when moving one piece reveals an attack from another piece behind it. When this attack is against the king, it becomes a discovered check - one of the most powerful tactical motifs.',
        duration: '45 minutes',
        order: 5
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610075477421-5ae80868558e?w=800',
    rating: 4.7
  },
  {
    title: 'Opening Repertoire - White Systems',
    description: 'Build a solid opening repertoire for White. Learn the London System, Italian Game, and Queen\'s Gambit - three reliable openings that will serve you well at any level.',
    category: 'openings',
    level: 'beginner',
    difficulty: 2,
    instructor: 'Opening Expert Academy',
    duration: '5 hours',
    lessons: [
      {
        title: 'Introduction to Opening Repertoire Building',
        content: 'Having a consistent opening repertoire is crucial for improvement. This lesson explains how to choose openings, study them systematically, and integrate them into your play.',
        duration: '30 minutes',
        order: 1
      },
      {
        title: 'The London System - Solid and Flexible',
        content: 'The London System (1.d4, 2.Bf4) is one of the most solid and flexible openings for White. It requires less memorization and focuses on piece development and central control.',
        duration: '60 minutes',
        order: 2
      },
      {
        title: 'Italian Game - Classical Chess',
        content: 'The Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) is one of the oldest and most respected openings. It leads to rich, strategic positions and teaches fundamental chess principles.',
        duration: '60 minutes',
        order: 3
      },
      {
        title: 'Queen\'s Gambit - Controlling the Center',
        content: 'The Queen\'s Gambit (1.d4 d5 2.c4) is a classical opening that aims to control the center with pawns. It has been played by world champions and remains a top choice today.',
        duration: '60 minutes',
        order: 4
      },
      {
        title: 'Opening Principles and Common Mistakes',
        content: 'Review the key opening principles and learn to avoid common mistakes that beginners make. This lesson consolidates your understanding and helps you apply your repertoire in real games.',
        duration: '30 minutes',
        order: 5
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    rating: 4.6
  },
  {
    title: 'Endgame Essentials - King and Pawn Endings',
    description: 'Master the fundamental endgames that decide games. Learn king and pawn endings, basic checkmates, and the key techniques that every player must know.',
    category: 'endgames',
    level: 'intermediate',
    difficulty: 3,
    instructor: 'Endgame Training Center',
    duration: '4 hours',
    lessons: [
      {
        title: 'Why Endgames Matter',
        content: 'Many games are decided in the endgame. Understanding endgame technique can save difficult positions and convert winning advantages. This lesson explains the importance of endgame study.',
        duration: '30 minutes',
        order: 1
      },
      {
        title: 'King and Pawn vs King',
        content: 'The most basic endgame: king and pawn against lone king. Learn the key concepts of opposition, triangulation, and how to promote pawns or prevent opponent promotion.',
        duration: '45 minutes',
        order: 2
      },
      {
        title: 'The Rule of the Square',
        content: 'The rule of the square is a fundamental calculation tool in king and pawn endings. Learn to quickly determine if a king can catch a passed pawn using this simple geometric concept.',
        duration: '30 minutes',
        order: 3
      },
      {
        title: 'Rook and Pawn Endings',
        content: 'Rook endgames are the most common type of endgame. Learn essential concepts like active vs passive rooks, the Lucena and Philidor positions, and how to play these critical endings.',
        duration: '60 minutes',
        order: 4
      },
      {
        title: 'Practical Endgame Calculation',
        content: 'Apply your endgame knowledge to practical positions. This lesson focuses on calculation techniques and how to approach endgame positions in real games.',
        duration: '45 minutes',
        order: 5
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?w=800',
    rating: 4.9
  },
  {
    title: 'Middlegame Strategy - Planning and Piece Coordination',
    description: 'Elevate your strategic understanding. Learn how to create plans, coordinate your pieces, and convert advantages in the complex middlegame.',
    category: 'middlegame',
    level: 'intermediate',
    difficulty: 3,
    instructor: 'Strategic Chess Academy',
    duration: '6 hours',
    lessons: [
      {
        title: 'Introduction to Middlegame Planning',
        content: 'The middlegame is where most games are decided. Unlike openings (theory) and endgames (calculation), the middlegame requires planning and strategic thinking. Learn how to formulate and execute plans.',
        duration: '40 minutes',
        order: 1
      },
      {
        title: 'Pawn Structure and Long-term Plans',
        content: 'Pawn structure determines the character of the position and guides your planning. Learn about good and bad pawn structures, isolated pawns, passed pawns, and how to play according to pawn structure.',
        duration: '60 minutes',
        order: 2
      },
      {
        title: 'Piece Activity and Coordination',
        content: 'Active pieces are more valuable than passive ones. Learn how to improve your pieces, coordinate them effectively, and maximize their power in the middlegame.',
        duration: '50 minutes',
        order: 3
      },
      {
        title: 'Prophylaxis - Preventing Opponent Plans',
        content: 'Prophylaxis is the art of preventing your opponent\'s plans before they can execute them. Learn to think defensively and anticipate your opponent\'s ideas.',
        duration: '45 minutes',
        order: 4
      },
      {
        title: 'Converting Advantages',
        content: 'Having an advantage is only the first step. Learn how to convert different types of advantages (material, positional, tactical) into wins through systematic improvement of your position.',
        duration: '45 minutes',
        order: 5
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569924507001-5be2bf856b71?w=800',
    rating: 4.8
  }
];

const puzzles = [
  {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    moves: [
      { san: 'Qxf7#', uci: 'h5f7' }
    ],
    solution: [
      { san: 'Qxf7#', uci: 'h5f7' }
    ],
    category: 'tactics',
    difficulty: 1,
    theme: 'Scholar\'s Mate',
    rating: 800
  },
  {
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    moves: [
      { san: 'Bb5+', uci: 'f1b5' }
    ],
    solution: [
      { san: 'Bb5+', uci: 'f1b5' }
    ],
    category: 'tactics',
    difficulty: 1,
    theme: 'Pin',
    rating: 900
  },
  {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    moves: [
      { san: 'Nf3', uci: 'g1f3' },
      { san: 'Nc6', uci: 'b8c6' },
      { san: 'Bc4', uci: 'f1c4' },
      { san: 'Nf6', uci: 'g8f6' },
      { san: 'Ng5', uci: 'f3g5' }
    ],
    solution: [
      { san: 'Ng5', uci: 'f3g5' }
    ],
    category: 'tactics',
    difficulty: 2,
    theme: 'Fried Liver Attack',
    rating: 1100
  },
  {
    fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
    moves: [
      { san: 'Kf2', uci: 'g1f2' },
      { san: 'Kf7', uci: 'g8f7' },
      { san: 'Ke3', uci: 'f2e3' },
      { san: 'Ke6', uci: 'f7e6' },
      { san: 'Kd4', uci: 'e3d4' },
      { san: 'Kd5', uci: 'e6d5' }
    ],
    solution: [
      { san: 'Kf2', uci: 'g1f2' }
    ],
    category: 'endgame',
    difficulty: 2,
    theme: 'Opposition',
    rating: 1000
  },
  {
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    moves: [
      { san: 'd5', uci: 'd7d5' }
    ],
    solution: [
      { san: 'd5', uci: 'd7d5' }
    ],
    category: 'opening',
    difficulty: 1,
    theme: 'Queen\'s Gambit Accepted',
    rating: 850
  },
  {
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    moves: [
      { san: 'Nf3', uci: 'g1f3' },
      { san: 'Nc6', uci: 'b8c6' },
      { san: 'Bc4', uci: 'f1c4' },
      { san: 'Nf6', uci: 'g8f6' },
      { san: 'd3', uci: 'd2d3' }
    ],
    solution: [
      { san: 'd3', uci: 'd2d3' }
    ],
    category: 'opening',
    difficulty: 1,
    theme: 'Italian Game',
    rating: 900
  },
  {
    fen: 'rnbqkbnr/ppp2ppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3',
    moves: [
      { san: 'c4', uci: 'c2c4' }
    ],
    solution: [
      { san: 'c4', uci: 'c2c4' }
    ],
    category: 'opening',
    difficulty: 1,
    theme: 'Caro-Kann Defense',
    rating: 950
  },
  {
    fen: 'r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6',
    moves: [
      { san: 'Ng5', uci: 'f3g5' }
    ],
    solution: [
      { san: 'Ng5', uci: 'f3g5' }
    ],
    category: 'tactics',
    difficulty: 2,
    theme: 'Attack on f7',
    rating: 1200
  },
  {
    fen: '8/8/8/8/8/5k2/5p2/6K1 w - - 0 1',
    moves: [
      { san: 'Kf2', uci: 'g1f2' },
      { san: 'Kg2', uci: 'f2g2' }
    ],
    solution: [
      { san: 'Kf2', uci: 'g1f2' }
    ],
    category: 'endgame',
    difficulty: 1,
    theme: 'King and Pawn',
    rating: 750
  },
  {
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 2',
    moves: [
      { san: 'exd6', uci: 'e5d6' }
    ],
    solution: [
      { san: 'exd6', uci: 'e5d6' }
    ],
    category: 'opening',
    difficulty: 1,
    theme: 'Caro-Kann Exchange',
    rating: 900
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Puzzle.deleteMany({});
    
    console.log('Existing data cleared');

    // Insert courses
    const insertedCourses = await Course.insertMany(courses);
    console.log(`${insertedCourses.length} courses inserted`);

    // Insert puzzles
    const insertedPuzzles = await Puzzle.insertMany(puzzles);
    console.log(`${insertedPuzzles.length} puzzles inserted`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
