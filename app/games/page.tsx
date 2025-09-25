"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft, Gamepad2, Trophy, Star, Users, Sun, Shuffle, Wind, Flower,
  Grid, Lightbulb, Box, Bot, CheckSquare, Smile, CloudRain, Sparkles, Hand, Blocks,
  Heart, Brain, Target, Timer, X, Check, RotateCcw, Volume2, VolumeX
} from "lucide-react"
import Link from "next/link"
import io from "socket.io-client"

interface Game {
  id: string
  title: string
  description: string
  mood: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  icon: React.ComponentType<any>
  color: string
  estimatedTime: string
  benefits: string[]
  popularity: number
}

interface LeaderboardPlayer {
  name: string
  score: number
  games: number
}

const games: Game[] = [
  // Relaxation Games
  { id: "breathing", title: "Breathing Bubbles", description: "Practice deep breathing with the 4-7-8 technique.", mood: ["anxious", "stressed"], difficulty: "Easy", category: "Relaxation", icon: Heart, color: "from-blue-400 to-cyan-500", estimatedTime: "5 min", benefits: ["Reduces anxiety", "Lowers heart rate"], popularity: 95 },
  
  // Cognitive Games
  { id: "memory", title: "Memory Palace", description: "Improve focus with card matching challenges.", mood: ["neutral", "calm"], difficulty: "Medium", category: "Cognitive", icon: Brain, color: "from-purple-400 to-indigo-500", estimatedTime: "10 min", benefits: ["Enhances memory", "Improves concentration"], popularity: 87 },
  { id: "affirmation-scramble", title: "Affirmation Scramble", description: "Unscramble positive affirmations against the clock.", mood: ["happy"], difficulty: "Medium", category: "Cognitive", icon: Shuffle, color: "from-pink-400 to-rose-500", estimatedTime: "5 min", benefits: ["Positive reinforcement", "Sharpens mind"], popularity: 85 },
  { id: "pattern-recall", title: "Pattern Recall", description: "Remember and repeat increasingly long light patterns.", mood: ["neutral"], difficulty: "Hard", category: "Memory", icon: Lightbulb, color: "from-slate-400 to-gray-500", estimatedTime: "8 min", benefits: ["Boosts memory", "Cognitive challenge"], popularity: 81 },
  { id: "grid-match", title: "Grid Match", description: "Quickly tap all shapes that match the target shape.", mood: ["neutral"], difficulty: "Medium", category: "Focus", icon: Grid, color: "from-gray-400 to-gray-600", estimatedTime: "5 min", benefits: ["Improves attention", "Sharpens recognition"], popularity: 78 },
  { id: "shape-sort", title: "Shape Sort", description: "Quickly swipe falling shapes into their correct bins.", mood: ["anxious", "stressed"], difficulty: "Medium", category: "Focus", icon: CheckSquare, color: "from-cyan-400 to-sky-500", estimatedTime: "5 min", benefits: ["Diverts attention", "Builds focus"], popularity: 86 },
  
  // Reaction Games
  { id: "sun-catcher", title: "Sun Catcher", description: "Tap floating suns to grow your thought garden.", mood: ["happy"], difficulty: "Easy", category: "Reaction", icon: Sun, color: "from-yellow-400 to-amber-500", estimatedTime: "3 min", benefits: ["Mood boost", "Quick fun"], popularity: 88 },
  { id: "balloon-pop", title: "Balloon Pop", description: "A fast-paced game to pop as many balloons as you can.", mood: ["anxious"], difficulty: "Easy", category: "Stress Relief", icon: Bot, color: "from-red-500 to-orange-500", estimatedTime: "3 min", benefits: ["Energy outlet", "Quick distraction"], popularity: 90 },
  { id: "tap-challenge", title: "Tap Challenge", description: "Tap a target as many times as possible in 10 seconds.", mood: ["anxious"], difficulty: "Easy", category: "Stress Relief", icon: Target, color: "from-gray-700 to-black", estimatedTime: "1 min", benefits: ["Physical release", "High-energy"], popularity: 84 },
  
  // Mindfulness Games
  { id: "river-guide", title: "River Guide", description: "Gently guide a boat down a calm river, avoiding obstacles.", mood: ["calm"], difficulty: "Easy", category: "Mindfulness", icon: Wind, color: "from-sky-300 to-blue-400", estimatedTime: "7 min", benefits: ["Relaxing", "Reduces stress"], popularity: 91 },
  { id: "petal-fall", title: "Petal Fall", description: "Gently push falling petals away from the center.", mood: ["calm"], difficulty: "Easy", category: "Mindfulness", icon: Flower, color: "from-rose-200 to-pink-300", estimatedTime: "5 min", benefits: ["Soothing", "Meditative"], popularity: 89 },
  { id: "raindrop-collector", title: "Raindrop Collector", description: "Collect raindrops to make the sun appear.", mood: ["sad"], difficulty: "Easy", category: "Mindfulness", icon: CloudRain, color: "from-slate-400 to-yellow-300", estimatedTime: "6 min", benefits: ["Hopeful theme", "Gentle interaction"], popularity: 88 },
  { id: "kindness-notes", title: "Kindness Notes", description: "Drag kind phrases into jars to watch them light up.", mood: ["sad"], difficulty: "Easy", category: "Mindfulness", icon: Smile, color: "from-fuchsia-300 to-purple-400", estimatedTime: "5 min", benefits: ["Positive self-talk", "Uplifting"], popularity: 92 },
  { id: "starry-night", title: "Starry Night", description: "Tap to fill a dark sky with beautiful, glowing stars.", mood: ["sad", "calm"], difficulty: "Easy", category: "Creative", icon: Sparkles, color: "from-gray-800 to-indigo-900", estimatedTime: "4 min", benefits: ["Creative expression", "Visually soothing"], popularity: 94 },
  
  // Coordination Games
  { id: "star-bounce", title: "Star Bounce", description: "Keep bouncing on floating stars for as long as you can.", mood: ["happy"], difficulty: "Medium", category: "Coordination", icon: Star, color: "from-indigo-300 to-purple-400", estimatedTime: "5 min", benefits: ["Engaging", "Improves focus"], popularity: 82 },
  { id: "box-stack", title: "Box Stack", description: "Stack falling boxes as high as you can without toppling.", mood: ["neutral"], difficulty: "Medium", category: "Coordination", icon: Box, color: "from-neutral-300 to-stone-400", estimatedTime: "6 min", benefits: ["Improves timing", "Engaging physics"], popularity: 79 },
  
  // Stress Relief Games
  { id: "bubble-buster", title: "Bubble Buster", description: "A satisfying game of popping endless bubbles.", mood: ["stressed"], difficulty: "Easy", category: "Stress Relief", icon: Hand, color: "from-sky-200 to-cyan-300", estimatedTime: "3 min", benefits: ["Satisfying feedback", "Mindless fun"], popularity: 96 },
  { id: "anger-crumple", title: "Anger Crumple", description: "Quickly swipe to crumple and discard paper.", mood: ["stressed"], difficulty: "Easy", category: "Stress Relief", icon: Hand, color: "from-red-600 to-gray-800", estimatedTime: "2 min", benefits: ["Symbolic release", "Physical action"], popularity: 89 },
  { id: "block-breaker", title: "Block Breaker", description: "Break walls of blocks with a bouncing ball.", mood: ["stressed"], difficulty: "Medium", category: "Focus", icon: Blocks, color: "from-blue-500 to-red-500", estimatedTime: "7 min", benefits: ["Engaging", "Cathartic"], popularity: 87 },
  
  // Creative Games
  { id: "wind-chime-tap", title: "Wind Chime Tap", description: "Tap chimes to create your own soothing melody.", mood: ["calm"], difficulty: "Easy", category: "Creative", icon: Wind, color: "from-stone-300 to-slate-400", estimatedTime: "4 min", benefits: ["Creative expression", "Calming audio"], popularity: 93 },
];

// ==================== GAME COMPONENTS ====================

// 1. Breathing Game
const BreathingGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          } else if (phase === 'exhale') {
            setPhase('rest');
            return 4;
          } else {
            setPhase('inhale');
            setCycle(prevCycle => {
              if (prevCycle >= 3) {
                onComplete(15);
                return 0;
              }
              return prevCycle + 1;
            });
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase, onComplete]);
  
  return (
    <div className="text-center p-8">
      <h3 className="text-2xl font-bold mb-4">Breathing Exercise (4-7-8)</h3>
      <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold transition-all duration-1000
        ${phase === 'inhale' ? 'bg-green-500 scale-110' : 
          phase === 'hold' ? 'bg-yellow-500 scale-100' : 
          phase === 'exhale' ? 'bg-blue-500 scale-90' : 
          'bg-gray-500 scale-100'}`}>
        {count}
      </div>
      <p className="mt-4 text-xl capitalize">{phase} ({count}s)</p>
      <p className="text-gray-600 mt-2">Cycle: {cycle + 1}/4 • Follow the breathing pattern</p>
      <div className="mt-4 grid grid-cols-4 gap-2 max-w-md mx-auto">
        {[1,2,3,4].map(num => (
          <div key={num} className={`h-2 rounded-full ${num <= cycle + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        ))}
      </div>
    </div>
  );
};

// 2. Memory Game
const MemoryGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [cards, setCards] = useState<{id: number, value: number, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  
  useEffect(() => {
    const values = [1,1,2,2,3,3,4,4,5,5,6,6];
    const shuffled = values.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    })).sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
  }, []);
  
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlippedCards;
      
      if (cards[first].value === cards[second].value) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          
          // Check if all matched
          if (updatedCards.every(card => card.matched)) {
            onComplete(20);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-center mb-4">Memory Palace</h3>
      <div className="text-center mb-4">
        <p>Moves: {moves} • Matches: {cards.filter(c => c.matched).length / 2}/6</p>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            } ${card.matched ? 'scale-105' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Affirmation Scramble Game
const AffirmationScrambleGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const affirmations = [
    "IAMCAPABLE", "IAMSTRONG", "IAMWORTHY", "IAMENOUGH", "IAMLOVED",
    "ICANDOIT", "IAMPEACEFUL", "IAMCONFIDENT", "IAMGRATEFUL", "IAMHAPPY"
  ];
  
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    newAffirmation();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          onComplete(score * 2);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onComplete, score]);
  
  const newAffirmation = () => {
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentAffirmation(affirmation);
    setScrambled(affirmation.split('').sort(() => Math.random() - 0.5).join(''));
    setInput("");
  };
  
  const checkAnswer = () => {
    if (input.toUpperCase().replace(/\s/g, '') === currentAffirmation) {
      setScore(score + 1);
      newAffirmation();
    }
  };
  
  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Affirmation Scramble</h3>
      <div className="mb-4">
        <p>Time: {timeLeft}s • Score: {score}</p>
      </div>
      <div className="bg-yellow-100 p-6 rounded-lg mb-4">
        <p className="text-2xl font-mono letter-spacing-2">{scrambled.split('').join(' ')}</p>
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the unscrambled affirmation..."
        className="mb-4 text-center text-lg"
        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
      />
      <Button onClick={checkAnswer} className="mr-2">Check Answer</Button>
      <Button onClick={newAffirmation} variant="outline">Skip</Button>
    </div>
  );
};

// 4. Pattern Recall Game
const PatternRecallGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<'showing' | 'guessing'>('showing');
  
  useEffect(() => {
    startLevel();
  }, [level]);
  
  const startLevel = () => {
    const newPattern = [...pattern, Math.floor(Math.random() * 9) + 1];
    setPattern(newPattern);
    setUserPattern([]);
    setPhase('showing');
    
    // Show pattern
    setTimeout(() => {
      setPhase('guessing');
    }, level * 1000);
  };
  
  const handleNumberClick = (num: number) => {
    if (phase !== 'guessing') return;
    
    const newUserPattern = [...userPattern, num];
    setUserPattern(newUserPattern);
    
    // Check if correct
    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      onComplete(level * 3);
      return;
    }
    
    // Check if level complete
    if (newUserPattern.length === pattern.length) {
      setLevel(level + 1);
    }
  };
  
  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Pattern Recall - Level {level}</h3>
      
      {phase === 'showing' ? (
        <div className="mb-6">
          <p className="text-lg mb-4">Watch the pattern carefully:</p>
          <div className="flex justify-center space-x-4">
            {pattern.map((num, index) => (
              <div key={index} className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {num}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-lg mb-4">Repeat the pattern:</p>
          <div className="flex justify-center space-x-2 mb-4">
            {userPattern.map((num, index) => (
              <div key={index} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <button
            key={num}
            className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-gray-300 disabled:opacity-50"
            onClick={() => handleNumberClick(num)}
            disabled={phase !== 'guessing'}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

// 5. Balloon Pop Game
const BalloonPopGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [balloons, setBalloons] = useState<{id: number, x: number, y: number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    const balloonInterval = setInterval(() => {
      setBalloons(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        x: Math.random() * 80 + 10, 
        y: 100 
      }]);
    }, 800);
    
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
      
      // Move balloons up
      setBalloons(prev => prev.map(balloon => ({
        ...balloon,
        y: Math.max(0, balloon.y - 5)
      })).filter(balloon => balloon.y > 0));
    }, 100);
    
    return () => {
      clearInterval(balloonInterval);
      clearInterval(gameTimer);
    };
  }, [onComplete, score]);
  
  const popBalloon = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
  };
  
  return (
    <div className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Balloon Pop</h3>
        <p>Time: {timeLeft}s • Score: {score}</p>
      </div>
      <div className="relative h-96 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 overflow-hidden">
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            className="absolute w-12 h-16 bg-red-500 rounded-full cursor-pointer transition-all duration-100"
            style={{ left: `${balloon.x}%`, bottom: `${balloon.y}%` }}
            onClick={() => popBalloon(balloon.id)}
          >
            <div className="w-1 h-8 bg-gray-400 absolute -bottom-8 left-1/2 transform -translate-x-1/2"></div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-gray-600">Click on balloons to pop them! Be quick!</p>
    </div>
  );
};

// 6. River Guide Game
const RiverGuideGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [boatPosition, setBoatPosition] = useState(50);
  const [obstacles, setObstacles] = useState<{id: number, x: number, y: number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    // Create obstacles
    const obstacleInterval = setInterval(() => {
      setObstacles(prev => [...prev, { 
        id: Date.now(), 
        x: Math.random() * 80 + 10, 
        y: 0 
      }]);
    }, 2000);
    
    // Game timer
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
      
      // Move obstacles down
      setObstacles(prev => prev.map(obs => ({
        ...obs,
        y: obs.y + 5
      })).filter(obs => obs.y < 100));
      
      // Check collisions
      obstacles.forEach(obs => {
        if (obs.y > 80 && Math.abs(obs.x - boatPosition) < 10) {
          setScore(prev => Math.max(0, prev - 5));
        }
      });
    }, 100);
    
    // Keyboard controls
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setBoatPosition(prev => Math.max(10, prev - 10));
      if (e.key === 'ArrowRight') setBoatPosition(prev => Math.min(90, prev + 10));
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      clearInterval(obstacleInterval);
      clearInterval(gameTimer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, score, obstacles, boatPosition]);
  
  return (
    <div className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">River Guide</h3>
        <p>Time: {timeLeft}s • Score: {score} • Use ← → keys to move</p>
      </div>
      <div className="relative h-96 bg-blue-100 rounded-lg border-2 border-blue-300 overflow-hidden">
        {/* River */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-400"></div>
        
        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute w-8 h-8 bg-red-500 rounded-full"
            style={{ left: `${obs.x}%`, top: `${obs.y}%` }}
          ></div>
        ))}
        
        {/* Boat */}
        <div
          className="absolute w-16 h-8 bg-brown-500 bottom-4"
          style={{ left: `${boatPosition}%` }}
        >
          <div className="w-16 h-8 bg-yellow-600 rounded-t-lg"></div>
          <div className="w-4 h-12 bg-white absolute -top-12 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// 7. Kindness Notes Game
const KindnessNotesGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const phrases = [
    "You matter", "You are enough", "You are loved", "You are strong",
    "You make a difference", "You are capable", "You are worthy", "You are amazing"
  ];
  
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  
  const handlePhraseSelect = (phrase: string) => {
    if (!selectedPhrases.includes(phrase)) {
      const newSelected = [...selectedPhrases, phrase];
      setSelectedPhrases(newSelected);
      setScore(newSelected.length * 5);
      
      if (newSelected.length === phrases.length) {
        onComplete(40);
      }
    }
  };
  
  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Kindness Notes</h3>
      <p className="mb-6">Drag kind phrases into your heart jar</p>
      
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Available phrases */}
        <div className="space-y-3">
          <h4 className="font-bold">Available Phrases</h4>
          {phrases.filter(p => !selectedPhrases.includes(p)).map(phrase => (
            <div
              key={phrase}
              className="p-3 bg-pink-100 rounded-lg cursor-pointer hover:bg-pink-200 transition-colors"
              onClick={() => handlePhraseSelect(phrase)}
            >
              {phrase}
            </div>
          ))}
        </div>
        
        {/* Heart jar */}
        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
          <h4 className="font-bold mb-3">Your Heart Jar</h4>
          <div className="min-h-48 space-y-2">
            {selectedPhrases.map(phrase => (
              <div key={phrase} className="p-2 bg-red-100 rounded text-red-800">
                {phrase}
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-red-600">
            Collected: {selectedPhrases.length}/{phrases.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Bubble Buster Game
const BubbleBusterGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  
  useEffect(() => {
    const bubbleInterval = setInterval(() => {
      setBubbles(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        x: Math.random() * 90 + 5, 
        y: Math.random() * 90 + 5,
        size: Math.random() * 30 + 20
      }]);
    }, 500);
    
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(bubbleInterval);
      clearInterval(gameTimer);
    };
  }, [onComplete, score]);
  
  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
  };
  
  return (
    <div className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Bubble Buster</h3>
        <p>Time: {timeLeft}s • Score: {score}</p>
      </div>
      <div className="relative h-96 bg-gradient-to-b from-cyan-100 to-blue-100 rounded-lg overflow-hidden">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full cursor-pointer border-2 border-white opacity-80 hover:opacity-100 transition-opacity"
            style={{ 
              left: `${bubble.x}%`, 
              top: `${bubble.y}%`, 
              width: `${bubble.size}px`, 
              height: `${bubble.size}px`,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(173,216,230,0.3))'
            }}
            onClick={() => popBubble(bubble.id)}
          ></div>
        ))}
      </div>
      <p className="mt-4 text-gray-600">Click on bubbles to pop them! So satisfying!</p>
    </div>
  );
};

// 9. Star Bounce Game
const StarBounceGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [star, setStar] = useState({ x: 50, y: 50, velocity: 5 });
  const [platform, setPlatform] = useState(40);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    if (gameOver) return;
    
    const gameLoop = setInterval(() => {
      setStar(prev => {
        const newY = prev.y + prev.velocity;
        const newVelocity = newY > 80 ? -Math.abs(prev.velocity) : prev.velocity + 0.2;
        
        // Check if on platform
        if (newY >= 80 && Math.abs(prev.x - platform) < 15) {
          setScore(prevScore => prevScore + 1);
          return { ...prev, y: 79, velocity: -12 };
        }
        
        // Check game over
        if (newY > 95) {
          setGameOver(true);
          onComplete(score);
        }
        
        return { ...prev, y: newY, velocity: newVelocity };
      });
    }, 50);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlatform(prev => Math.max(5, prev - 10));
      if (e.key === 'ArrowRight') setPlatform(prev => Math.min(85, prev + 10));
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver, onComplete, score, platform]);
  
  return (
    <div className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Star Bounce</h3>
        <p>Score: {score} • Use ← → keys to move platform</p>
      </div>
      <div className="relative h-96 bg-gradient-to-b from-purple-900 to-indigo-900 rounded-lg overflow-hidden">
        {/* Star */}
        <div
          className="absolute text-yellow-300 text-2xl"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          ⭐
        </div>
        
        {/* Platform */}
        <div
          className="absolute h-4 bg-gray-300 bottom-4 rounded-lg"
          style={{ left: `${platform}%`, width: '30%' }}
        ></div>
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-2">Game Over!</h4>
              <p>Final Score: {score}</p>
              <Button onClick={() => window.location.reload()} className="mt-3">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 10. Box Stack Game
const BoxStackGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [boxes, setBoxes] = useState<{id: number, x: number}[]>([]);
  const [currentBox, setCurrentBox] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    if (gameOver) return;
    
    const moveInterval = setInterval(() => {
      setCurrentBox(prev => {
        if (prev >= 90) return 10;
        return prev + 0.5;
      });
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [gameOver]);
  
  const dropBox = () => {
    const newBoxes = [...boxes, { id: Date.now(), x: currentBox }];
    setBoxes(newBoxes);
    
    // Check if game over (boxes too high)
    if (newBoxes.length > 15) {
      setGameOver(true);
      onComplete(score);
    } else {
      setScore(newBoxes.length);
    }
  };
  
  return (
    <div className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Box Stack</h3>
        <p>Score: {score} • Press SPACE to drop boxes</p>
      </div>
      
      <div 
        className="relative h-96 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-pointer"
        onClick={dropBox}
      >
        {/* Moving box */}
        <div
          className="absolute w-16 h-8 bg-orange-500 bottom-4"
          style={{ left: `${currentBox}%` }}
        ></div>
        
        {/* Stacked boxes */}
        {boxes.map((box, index) => (
          <div
            key={box.id}
            className="absolute w-16 h-8 bg-orange-500"
            style={{ 
              left: `${box.x}%`, 
              bottom: `${4 + index * 8}%`,
              opacity: 1 - (index * 0.05)
            }}
          ></div>
        ))}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-2">Tower Toppled!</h4>
              <p>Height: {score} boxes</p>
              <Button onClick={() => window.location.reload()} className="mt-3">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-gray-600">Click or press SPACE to drop boxes. Build the highest tower!</p>
    </div>
  );
};

// ==================== MAIN GAMES PAGE ====================

export default function GamesPage() {
  const [selectedMood, setSelectedMood] = useState<string>("all")
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [completedGames, setCompletedGames] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
  transports: ["websocket"],
  withCredentials: true,
});
    const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games`;
  const fetchInitialData = async () => {
  try {
    const leaderboardRes = await fetch(`${API_BASE_URL}/leaderboard`);
    if (leaderboardRes.ok) {
      const leaderboardData = await leaderboardRes.json();
      setLeaderboard(leaderboardData);

      const youPlayer = leaderboardData.find((p: LeaderboardPlayer) => p.name === "You");
      if (youPlayer) {
        setScore(youPlayer.score);
        setCompletedGames(Array(youPlayer.games).fill("dummy"));
      }
    } else {
      console.error('Failed to fetch leaderboard:', leaderboardRes.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

    fetchInitialData();

    socketRef.current.on('leaderboardUpdate', (newLeaderboard: LeaderboardPlayer[]) => {
      setLeaderboard(newLeaderboard);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleGameComplete = async (gameId: string, points: number) => {
    let newScore = score + points;
    let newCompletedGames = [...completedGames];
    
    if (!completedGames.includes(gameId)) {
      newCompletedGames.push(gameId);
    }
    
    setScore(newScore);
    setCompletedGames(newCompletedGames);
    
    try {
      const response = await fetch('https://sih-backend-sx3p.onrender.com/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'You',
          score: newScore,
          games: newCompletedGames.length
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        
        if (socketRef.current) {
          socketRef.current.emit('updateScore', { leaderboard: data.leaderboard });
        }
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
    
    setActiveGame(null);
  };

  const renderGame = () => {
    switch (activeGame) {
      case "breathing": return <BreathingGame onComplete={(points) => handleGameComplete("breathing", points)} />;
      case "memory": return <MemoryGame onComplete={(points) => handleGameComplete("memory", points)} />;
      case "affirmation-scramble": return <AffirmationScrambleGame onComplete={(points) => handleGameComplete("affirmation-scramble", points)} />;
      case "pattern-recall": return <PatternRecallGame onComplete={(points) => handleGameComplete("pattern-recall", points)} />;
      case "balloon-pop": return <BalloonPopGame onComplete={(points) => handleGameComplete("balloon-pop", points)} />;
      case "river-guide": return <RiverGuideGame onComplete={(points) => handleGameComplete("river-guide", points)} />;
      case "kindness-notes": return <KindnessNotesGame onComplete={(points) => handleGameComplete("kindness-notes", points)} />;
      case "bubble-buster": return <BubbleBusterGame onComplete={(points) => handleGameComplete("bubble-buster", points)} />;
      case "star-bounce": return <StarBounceGame onComplete={(points) => handleGameComplete("star-bounce", points)} />;
      case "box-stack": return <BoxStackGame onComplete={(points) => handleGameComplete("box-stack", points)} />;
      
      // Placeholder for other games
      default: 
        const game = games.find(g => g.id === activeGame);
        return game ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <h3 className="text-2xl font-bold">{game.title}</h3>
            <p className="text-gray-500">Game coming soon!</p>
            <Button onClick={() => handleGameComplete(game.id, 10)} className="bg-green-600 hover:bg-green-700">
              Complete Game
            </Button>
          </div>
        ) : <div>Game not found</div>;
    }
  };

  const moods = [
    { id: "all", label: "All Games" },
    { id: "happy", label: "😊 Happy" },
    { id: "calm", label: "🧘 Calm" },
    { id: "neutral", label: "😐 Neutral" },
    { id: "anxious", label: "😟 Anxious" },
    { id: "sad", label: "😢 Sad" },
    { id: "stressed", label: "⚡ Stressed" },
  ];

  const filteredGames = selectedMood === "all" ? games : games.filter((game) => game.mood.includes(selectedMood));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Gamepad2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Wellness Games</h1>
                <p className="text-sm text-gray-600">Play games to improve your mental health</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                <Trophy className="h-4 w-4 mr-1" /> Score: {score}
              </Badge>
              <Badge variant="outline">
                <Star className="h-4 w-4 mr-1" /> {completedGames.length} completed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeGame ? (
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {games.find((g) => g.id === activeGame)?.title}
                </CardTitle>
                <Button onClick={() => setActiveGame(null)} variant="outline">
                  Back to Games
                </Button>
              </div>
            </CardHeader>
            <CardContent className="min-h-[500px] flex items-center justify-center">
              {renderGame()}
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Filter by Mood</h2>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      {mood.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => {
                  const Icon = game.icon;
                  const isCompleted = completedGames.includes(game.id);
                  return (
                    <Card
                      key={game.id}
                      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                      onClick={() => setActiveGame(game.id)}
                    >
                      <CardContent className="p-4">
                        <div className={`w-full h-32 bg-gradient-to-br ${game.color} rounded-lg mb-4 flex items-center justify-center relative`}>
                          <Icon className="h-12 w-12 text-white" />
                          {isCompleted && (
                            <div className="absolute top-2 right-2">
                              <Trophy className="h-6 w-6 text-yellow-300" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline">{game.difficulty}</Badge>
                          <Badge variant="secondary">{game.estimatedTime}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" /> Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboard
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          player.name === "You" ? "bg-green-100 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-600">#{index + 1}</span>
                          <span className={`font-medium ${player.name === "You" ? "text-green-700" : "text-gray-700"}`}>
                            {player.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{player.score}</p>
                          <p className="text-xs text-gray-500">{player.games} games</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}