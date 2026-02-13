import filter from 'leo-profanity'

// Configure profanity filter (Russian + English dictionaries)
filter.loadDictionary('en')
filter.add(filter.getDictionary('ru'))

export const cleanText = text => filter.clean(text ?? '')

export const hasProfanity = text => filter.check(text ?? '')

export default filter
