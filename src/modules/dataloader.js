import {
    GiftItem,
    GiftItemVariant,
    Villager,
    Catalog,
    Roster
    } from 'modules/entity.js';

const getImageUrl = (jsonVariant) => {
    /* TODO: currently limited to clothes and bags */
    return jsonVariant.storageImage;
};

function makeGiftItem(jsonItem) {
    let vMap = new Map();
    const defaultVariant = jsonItem.variants[0];
    for(const jVariant of jsonItem.variants){
        const variant = new GiftItemVariant(
            jVariant.uniqueEntryId,
            jVariant.variation,
            jVariant.colors.map(c => c.toLowerCase()),
            getImageUrl(jVariant)
        );
        vMap.set(jVariant.uniqueEntryId, variant);
    }
    let styles = [(jsonItem.style1 && jsonItem.style1.toLowerCase()) || null,
        (jsonItem.style2 && jsonItem.style2.toLowerCase()) || null]
    return new GiftItem(
        '_' + defaultVariant.uniqueEntryId,
        jsonItem.name.toLowerCase(),
        defaultVariant.sell,
        vMap,
        styles,
        jsonItem.sourceSheet
    );
}

function makeVillager(jsonVillager){
    return new Villager(
        jsonVillager.uniqueEntryId,
        jsonVillager.name,
        jsonVillager.colors.map( (color) => color.toLowerCase() ),
        jsonVillager.styles.map( (style) => style.toLowerCase() ),
        jsonVillager.iconImage
    );
}

function makeCatalog(jsonItems, inclCats){
    let items = [];
    for(const jItem of jsonItems){
        if(inclCats.includes(jItem.sourceSheet)) {
            items.push(makeGiftItem(jItem));
        }
    }
    items.sort(GiftItem.sortComparator)
    return new Catalog(items);
}
function makeRoster(jsonVillagers){
    let members = [];
    for(const jVillager of jsonVillagers){
        members.push(makeVillager(jVillager));
    }
    members.sort(Villager.sortComparator);
    return new Roster(members);
}

export {makeCatalog, makeGiftItem, makeRoster, makeVillager};