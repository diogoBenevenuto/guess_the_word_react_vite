
//React
import { useCallback, useEffect, useState } from 'react';

//Data
import {wordsList} from "./data/word";


//Componets
import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import GameOver from './Components/GameOver';

//CSS
import './App.css'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQtd = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [word] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedsLetter] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQtd)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(word);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];


    const words = word[category][Math.floor(Math.random() * word[category].length)];


    return{words, category}
  }, [word]);


  const startGame = useCallback (() => {

    clearLetterState();

    const {category, words} = pickWordAndCategory();

    let wordLetters = words.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(words)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the latter input

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){

      return;
    }

    if(letters.includes(normalizedLetter)){
      setGuessedsLetter((actualGuessesLetters) => [
        ...actualGuessesLetters,
        normalizedLetter
      ])
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1 );
    }

  };

  const clearLetterState = () => {
    setGuessedsLetter([]);
    setWrongLetters([]);
  }

  // check win condition

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){

      setScore((actualScore) => (actualScore += 100));

      startGame();

    }

  }, [guessedLetters, letters, startGame])
  

  // Check if guesses ended
  useEffect(() => {
    if(guesses <= 0) {
      //reset all states

      clearLetterState();

      setGameStage(stages[2].name);
    }
  }, [guesses])

  // restart the game
  const retry = () => {

    setScore(0);
    setGuesses(guessesQtd);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame = {startGame}/>}

      {gameStage === "game" && <Game verifyLetter = {verifyLetter} pickedWord = {pickedWord} 
        pickedCategory = {pickedCategory} letters = {letters} guessedLetters = {guessedLetters} 
        wrongLetters = {wrongLetters} guesses = {guesses} score = {score} />}

      {gameStage === "end" && <GameOver retry = {retry} score={score}/>}
    </div>
  )
}

export default App
