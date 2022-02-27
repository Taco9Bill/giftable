import { GiftItem, GiftItemVariant, Villager } from 'modules/entity.js'

const NON_MATCHING_STYLE_DISTINCT = 'noStyleMatchDistinct'
const BOTH_STYLES_MATCHING_DISTINCT = 'bothStylesMatchDistinct'
const ONE_STYLE_MATCHING = 'oneStyleMatches'
const NON_MATCHING_STYLE_DUPLICATED = 'noStyleMatchDup'
const BOTH_STYLES_MATCHING_DUPLICATED = 'bothStylesMatchDup'

const NON_MATCHING_COLORS_DISTINCT = 'noColorMatchDistinct'
const NON_MATCHING_COLORS_DUPLICATED = 'noColorMatchDup'
const BOTH_COLORS_MATCHING_DISTINCT = 'bothColorsMatchDistinct'
const BOTH_COLORS_MATCHING_DUPLICATED = 'bothColorsMatchDup'
const ONE_COLOR_MATCHING = 'oneColorMatches'

const [DUMMY_COLOR_1, DUMMY_COLOR_2] = ['c_dummy1', 'c_dummy2']
const [DUMMY_STYLE_1, DUMMY_STYLE_2] = ['s_dummy1', 's_dummy2']
const DUMMY_CATEGORY = 'cat_dummy'

const COLOR_PREFS = ['pink', 'red']
const STYLE_PREFS = ['cute', 'elegant']

const variants = new Map()
let villager

beforeAll(() => {
    const name = 'Katie'
    villager = new Villager(`_${name}`, name, COLOR_PREFS, STYLE_PREFS, null)

    const [color1, color2] = villager.colorPrefs
    let variant = null    
    variant = new GiftItemVariant(`_${NON_MATCHING_COLORS_DISTINCT}`, NON_MATCHING_COLORS_DISTINCT, [DUMMY_COLOR_1, DUMMY_COLOR_2], null)
    variants.set(variant.id, variant)
    variant = new GiftItemVariant(`_${NON_MATCHING_COLORS_DUPLICATED}`, NON_MATCHING_COLORS_DUPLICATED, [DUMMY_COLOR_1, DUMMY_COLOR_1], null)
    variants.set(variant.id, variant)
    variant = new GiftItemVariant(`_${BOTH_COLORS_MATCHING_DISTINCT}`, BOTH_COLORS_MATCHING_DISTINCT, [color1, color2], null)
    variants.set(variant.id, variant)
    variant = new GiftItemVariant(`_${BOTH_COLORS_MATCHING_DUPLICATED}`, BOTH_COLORS_MATCHING_DUPLICATED, [color1, color1], null)
    variants.set(variant.id, variant)
    variant = new GiftItemVariant(`_${ONE_COLOR_MATCHING}`, ONE_COLOR_MATCHING, [color1, DUMMY_COLOR_1], null)
    variants.set(variant.id, variant)
})

describe('item with distinct styles, neither matching preference', () => {
    let gift;

    beforeEach( () => {
        gift = new GiftItem(`_${NON_MATCHING_STYLE_DISTINCT}`, NON_MATCHING_STYLE_DISTINCT, 0, variants, [DUMMY_STYLE_1, DUMMY_STYLE_2], DUMMY_CATEGORY)
    })

    it('is not preferred by style', () => {
        const matches = villager.checkGiftStyle(gift)
        expect(matches.length).toBe(0)
    })

    describe('...and item variant has distinct colors', () => {    
        it('is not preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(0)
            expect(liked).toBe(false)
        })
     
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(2)
            expect(liked).toBe(true)
        }) 
    
        it('is preferred when either color is preferred', () => {
            const variantId = `_${ONE_COLOR_MATCHING}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })

    describe('...and item variant has duplicate colors', () => {
        it('is not preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(0)
            expect(liked).toBe(false)
        })
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })
})

describe('item with distinct styles, both matching preference', () => {
    let gift;

    beforeEach( () => {
        const [style1, style2] = villager.stylePrefs
        gift = new GiftItem(`_${BOTH_STYLES_MATCHING_DISTINCT}`, BOTH_STYLES_MATCHING_DISTINCT, 0, variants, [style1, style2], DUMMY_CATEGORY)
    })

    it('is preferred by style', () => {
        const matches = villager.checkGiftStyle(gift)
        expect(matches.length).toBe(2)
    })

    describe('...and item variant has distinct colors', () => {    
        it('is preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(2)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })
     
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(2)
            expect(color.length).toBe(2)
            expect(liked).toBe(true)
        }) 
    
        it('is preferred when either color is preferred', () => {
            const variantId = `_${ONE_COLOR_MATCHING}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(2)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })

    describe('...and item variant has duplicate colors', () => {
        it('is preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(2)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(2)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })
})

describe('item with distinct styles, one matching preference', () => {
    let gift;

    beforeEach( () => {
        const [style1, style2] = villager.stylePrefs
        gift = new GiftItem(`_${ONE_STYLE_MATCHING}`, ONE_STYLE_MATCHING, 0, variants, [style1, DUMMY_STYLE_1], DUMMY_CATEGORY)
    })

    it('is preferred by style', () => {
        const matches = villager.checkGiftStyle(gift)
        expect(matches.length).toBe(1)
    })

    describe('...and item variant has distinct colors', () => {    
        it('is preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })
     
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(2)
            expect(liked).toBe(true)
        })
    
        it('is preferred when either color is preferred', () => {
            const variantId = `_${ONE_COLOR_MATCHING}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })

    describe('and item variant has duplicate colors', () => {
        it('is preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })

        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        })
    })
})

describe('item with duplicate styles does not match preference', () => {
    let gift;
    beforeEach( () => {
        gift = new GiftItem(`_${NON_MATCHING_STYLE_DUPLICATED}`, NON_MATCHING_STYLE_DUPLICATED, 0, variants, [DUMMY_STYLE_1, DUMMY_STYLE_1], DUMMY_CATEGORY)
    })

    it('does not match style preference', () => {
        const matches = villager.checkGiftStyle(gift)
        expect(matches.length).toBe(0)
    })
    
    describe('...and item variant has distinct colors', () => {    
        it('is not preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(0)
            expect(liked).toBe(false)
        })

        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(2)
            expect(liked).toBe(true)
        }) 

        it('is preferred when either color is preferred', () => {
            const variantId = `_${ONE_COLOR_MATCHING}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        })
    })

    describe('...and item variant has duplicate colors', () => {   
        it('is not preferred when color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(0)
            expect(liked).toBe(false)
        }) 
     
        it('is preferred when color is preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(0)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })
})

describe('item with duplicate styles', () => {
    let gift;

    beforeEach( () => {
        const [style1, style2] = villager.stylePrefs
        gift = new GiftItem(`_${BOTH_STYLES_MATCHING_DUPLICATED}`, BOTH_STYLES_MATCHING_DUPLICATED, 0, variants, [style1, style1], DUMMY_CATEGORY)
    })

    it('does match style preference', () => {
        const matches = villager.checkGiftStyle(gift)
        expect(matches.length).toBe(1)
    })

    describe('...and item variant has distinct colors', () => {    
        it('is preferred when neither color is preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })
     
        it('is preferred when both colors are preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DISTINCT}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(2)
            expect(liked).toBe(true)
        }) 
    
        it('is preferred when either color is preferred', () => {
            const variantId = `_${ONE_COLOR_MATCHING}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })

    describe('...and item variant has duplicate colors', () => {
        it('is preferred when color is not preferred', () => {
            const variantId = `_${NON_MATCHING_COLORS_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(0)
            expect(liked).toBe(true)
        })
        it('is preferred when color is preferred', () => {
            const variantId = `_${BOTH_COLORS_MATCHING_DUPLICATED}`
            const {liked, style, color} = villager.checkGift(gift, variantId)
            expect(style.length).toBe(1)
            expect(color.length).toBe(1)
            expect(liked).toBe(true)
        }) 
    })
})