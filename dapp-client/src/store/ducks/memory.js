import { createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

const CARD_DATA = [
    { name: 'fries', img: '/images/fries.png' },
    { name: 'cheeseburger', img: '/images/cheeseburger.png' },
    { name: 'ice-cream', img: '/images/ice-cream.png' },
    { name: 'pizza', img: '/images/pizza.png' },
    { name: 'milkshake', img: '/images/milkshake.png' },
    { name: 'hotdog', img: '/images/hotdog.png' },
    { name: 'fries', img: '/images/fries.png' },
    { name: 'cheeseburger', img: '/images/cheeseburger.png' },
    { name: 'ice-cream', img: '/images/ice-cream.png' },
    { name: 'pizza', img: '/images/pizza.png' },
    { name: 'milkshake', img: '/images/milkshake.png' },
    { name: 'hotdog', img: '/images/hotdog.png' }
  ]

/**
 * Action types & creators
 */
 export const { Types, Creators } = createActions({
    getCardData: [],
    flipCard: ["cardId"],
    clearChosenCards: [],
    setWonCard: ["optionOneId", "optionTwoId"]
 });

const INITIAL_STATE = Immutable({
    loading: false,
    cardData: CARD_DATA,
    cardsWon: [],
    cardsChosen: [],
    cardsChosenId: []
})

const getCardData = (state = INITIAL_STATE, action)  => {
    return state.cardData
}

const flipCard = (state = INITIAL_STATE, action)  => {
    const cardId = action.cardId
    
    return state.merge({...state, 
        cardsChosen: [...state.cardsChosen, state.cardData[cardId].name],
        cardsChosenId: [...state.cardsChosenId, cardId]
    })
}

const clearChosenCards = (state = INITIAL_STATE, action)  => 
    state.merge({...state, cardsChosen: [], cardsChosenId: []})

const setWonCard = (state = INITIAL_STATE, action)  => 
    state.merge({...state, cardsWon: [...state.cardsWon, action.optionOneId, action.optionTwoId]})

export const MemoryTypes = Types;

export default createReducer(INITIAL_STATE, {
    [Types.GET_CARD_DATA]: getCardData,
    [Types.FLIP_CARD]: flipCard,
    [Types.CLEAR_CHOSEN_CARDS]: clearChosenCards,
    [Types.SET_WON_CARD]: setWonCard
});