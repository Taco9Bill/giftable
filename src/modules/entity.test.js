import { GiftItem, GiftItemVariant, Villager } from 'modules/entity.js'
import {makeGiftItem, makeVillager} from 'modules/dataloader.js'

describe('', () => {
    let villager;
    let gift;

    beforeEach(() =>  {
        villager = new Villager('_Aurora', 'Aurora', ['pink', 'red'], ['cute', 'elegant'], null)
        let variants = new Map()
        variants.set(
            '_RedAcademyUniform',
            new GiftItemVariant('_RedAcademyUniform', 'Red', ['red', 'white'], null)
        )
        gift = new GiftItem('_AcademyUniform', 'academy uniform', 520, variants, ['elegant'], 'Dress-Up')

    })

    test('villager style matches item style', () => {
        let ret = villager.checkGiftStyle(gift)
        expect(ret.liked).toBe(true)
        expect(ret.reason).toBe('elegant')
    })
})
