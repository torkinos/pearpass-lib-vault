import { selectFolders } from './selectFolders'

const mockSelectRecords = require('./selectRecords').selectRecords

jest.mock('./selectRecords', () => ({
  selectRecords: jest.fn()
}))

describe('selectFolders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return default structure when no records', () => {
    mockSelectRecords.mockImplementation(() => () => ({
      isLoading: false,
      data: []
    }))

    const selector = selectFolders()
    const result = selector({})

    expect(result).toEqual({
      isLoading: false,
      data: {
        favorites: { records: [] },
        noFolder: { records: [] },
        customFolders: {}
      }
    })
  })

  test('should correctly categorize records by folders', () => {
    const mockRecords = [
      { id: 1, folder: 'Work', isFavorite: false },
      { id: 2, folder: 'Personal', isFavorite: true },
      { id: 3, folder: null, isFavorite: false },
      { id: 4, folder: 'Work', isFavorite: true },
      { id: 5, folder: undefined, isFavorite: false }
    ]

    mockSelectRecords.mockImplementation(() => () => ({
      isLoading: false,
      data: mockRecords
    }))

    const selector = selectFolders()
    const result = selector({})

    expect(result).toEqual({
      isLoading: false,
      data: {
        favorites: {
          records: [
            { id: 2, folder: 'Personal', isFavorite: true },
            { id: 4, folder: 'Work', isFavorite: true }
          ]
        },
        noFolder: {
          records: [
            { id: 3, folder: null, isFavorite: false },
            { id: 5, folder: undefined, isFavorite: false }
          ]
        },
        customFolders: {
          Work: {
            name: 'Work',
            records: [
              { id: 1, folder: 'Work', isFavorite: false },
              { id: 4, folder: 'Work', isFavorite: true }
            ]
          },
          Personal: {
            name: 'Personal',
            records: [{ id: 2, folder: 'Personal', isFavorite: true }]
          }
        }
      }
    })
  })

  test('should handle loading state', () => {
    mockSelectRecords.mockImplementation(() => () => ({
      isLoading: true,
      data: null
    }))

    const selector = selectFolders()
    const result = selector({})

    expect(result).toEqual({
      isLoading: true,
      data: undefined
    })
  })

  test('should pass isFolder filter to selectRecords', () => {
    mockSelectRecords.mockImplementation(() => () => ({
      isLoading: false,
      data: []
    }))

    selectFolders()

    expect(mockSelectRecords).toHaveBeenCalledWith({
      filters: {
        isFolder: true
      }
    })
  })

  test('should filter folders by search pattern', () => {
    const mockRecords = [
      { id: 1, folder: 'Work', isFavorite: false },
      { id: 2, folder: 'Personal', isFavorite: false },
      { id: 3, folder: 'Documents', isFavorite: false }
    ]

    mockSelectRecords.mockImplementation(() => () => ({
      isLoading: false,
      data: mockRecords
    }))

    const selector = selectFolders({ searchPattern: 'work' })
    const result = selector({})

    // Only 'Work' folder should match the pattern
    expect(result.data.customFolders).toHaveProperty('Work')
    expect(result.data.customFolders).not.toHaveProperty('Personal')
    expect(result.data.customFolders).not.toHaveProperty('Documents')
  })
})
