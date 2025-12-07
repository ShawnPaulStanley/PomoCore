import { Quote } from '../types';

const BACKUP_QUOTES = [
  { text: "Breathe in, breathe out. You got this.", author: "PomoCore" },
  { text: "Progress is progress, no matter how small.", author: "Unknown" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Small steps lead to big changes.", author: "Unknown" },
  { text: "Your potential is endless.", author: "PomoCore" },
  { text: "Study now. Be proud later.", author: "Unknown" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "You didn't come this far to only come this far.", author: "Unknown" },
  { text: "Be the energy you want to attract.", author: "Unknown" },
  { text: "Old ways won't open new doors.", author: "Unknown" },
  { text: "Growth happens outside your comfort zone.", author: "Unknown" },
  { text: "Do it for your future self.", author: "PomoCore" },
  { text: "A river cuts through rock not because of its power, but its persistence.", author: "Jim Watkins" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You are capable of more than you know.", author: "Glinda" },
  { text: "Don't stop until you're proud.", author: "Unknown" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Little by little, one travels far.", author: "J.R.R. Tolkien" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Be stronger than your excuses.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The struggle you're in today is developing the strength you need for tomorrow.", author: "Unknown" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Trust the process.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Stay patient and trust your journey.", author: "Unknown" },
  { text: "Keep going. Everything you need will come to you at the perfect time.", author: "Unknown" },
  { text: "Focus on the step in front of you, not the whole staircase.", author: "Unknown" },
  { text: "Bloom where you are planted.", author: "Unknown" },
  { text: "Make it happen. Shock everyone.", author: "Unknown" },
  { text: "Don't decrease the goal. Increase the effort.", author: "Unknown" },
  { text: "Your speed doesn't matter, forward is forward.", author: "Unknown" },
  { text: "If you get tired, learn to rest, not to quit.", author: "Banksy" },
  { text: "Mistakes are proof that you are trying.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Great things never came from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The distance between dreams and reality is called action.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
  { text: "Optimism is the faith that leads to achievement.", author: "Helen Keller" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Failure is the condiment that gives success its flavor.", author: "Truman Capote" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Study while others are sleeping; work while others are loafing.", author: "William Arthur Ward" },
  { text: "To know how much there is to know is the beginning of learning to live.", author: "Dorothy West" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "Perseverance is failing 19 times and succeeding the 20th.", author: "Julie Andrews" },
  { text: "Grit is that 'extra something' that separates the most successful people from the rest.", author: "Travis Bradberry" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "Self-discipline is the magic power that makes you virtually unstoppable.", author: "Dan Kennedy" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Stop doubting yourself, work hard, and make it happen.", author: "Unknown" },
  { text: "Don't tell people your plans. Show them your results.", author: "Unknown" }
];

const BACKUP_MEOW_QUOTES = [
  { text: "Meow. (Just do the thing, human.)", author: "Professor Whiskers" },
  { text: "Purr-ductivity is key.", author: "Juno" },
  { text: "Nap later, study now. Then treats.", author: "Shawn's Cat" },
  { text: "Stay curious. And feed me.", author: "The Cat" },
  { text: "Whatever you're doing, do it with cattitude.", author: "Juno" },
  { text: "Knock your goals off the table like a glass of water.", author: "Juno" },
  { text: "I am the main character. You are the student.", author: "Juno" },
  { text: "Study hard so you can buy me better tuna.", author: "The Boss" },
  { text: "If I fits, I sits. If you studies, you wins.", author: "Juno" },
  { text: "Don't let the laser pointer of distraction catch you.", author: "Sensei Meow" },
  { text: "Stretch. Yawn. Focus. Repeat.", author: "Yoga Cat" },
  { text: "Judgemental stare... (Get back to work)", author: "Juno" },
  { text: "You are doing great. Now pet me.", author: "Juno" },
  { text: "Be sleek, be sharp, be ready to pounce on knowledge.", author: "Hunter Cat" },
  { text: "My litter box is cleaner than your study schedule. Fix it.", author: "Sassy Cat" },
  { text: "Keep calm and purr on.", author: "British Shorthair" },
  { text: "No more cat videos until you finish this chapter.", author: "Juno" },
  { text: "I believe in you. Mostly because you feed me.", author: "Juno" },
  { text: "Study like a cat stalking a bug. Intense focus.", author: "Hunter" },
  { text: "Your laptop is warm. I sit. You study book instead.", author: "Juno" },
  { text: "9 lives, 1 degree to get. Let's go.", author: "Juno" },
  { text: "Pawsitive vibes only.", author: "Kitten" },
  { text: "Slow blink... that means 'You got this'.", author: "Juno" },
  { text: "Don't be a scaredy cat. Tackle that assignment.", author: "Juno" },
  { text: "Hiss at procrastination.", author: "Angry Cat" },
  { text: "Groom your mind with knowledge.", author: "Clean Cat" },
  { text: "Climb the tree of knowledge. Don't get stuck.", author: "Tree Cat" },
  { text: "Chase excellence like it's a red dot.", author: "Juno" },
  { text: "Sleep 18 hours, study 6. Efficient.", author: "Lazy Cat" },
  { text: "Your handwriting is like chicken scratch. I approve.", author: "Juno" }
];

// Track history of used quotes to prevent repetition
const quoteHistory: number[] = [];
const meowHistory: number[] = [];
const HISTORY_SIZE = 15;

export const generateQuote = async (meowMode: boolean): Promise<Quote> => {
  const list = meowMode ? BACKUP_MEOW_QUOTES : BACKUP_QUOTES;
  return getUniqueBackupQuote(list, meowMode);
};

const getUniqueBackupQuote = (list: Quote[], meowMode: boolean): Quote => {
  const history = meowMode ? meowHistory : quoteHistory;
  let randomIndex;
  let attempts = 0;
  
  // Try to find an index that hasn't been used recently
  do {
    randomIndex = Math.floor(Math.random() * list.length);
    attempts++;
  } while (history.includes(randomIndex) && attempts < 50);

  // Update history queue
  history.push(randomIndex);
  if (history.length > HISTORY_SIZE) {
    history.shift(); // Remove oldest
  }
  
  return list[randomIndex];
};
