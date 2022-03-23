import {
    GiftItem,
    GiftItemVariant,
    Villager,
    Catalog,
    Roster
    } from 'modules/entity.js';

let Category = {};
(function (Category) {
    Category["Accessories"] = "Accessories";
    Category["Art"] = "Art";
    Category["Bags"] = "Bags";
    Category["Bottoms"] = "Bottoms";
    Category["DressUp"] = "Dress-Up";
    Category["Fencing"] = "Fencing";
    Category["Floors"] = "Floors";
    Category["Fossils"] = "Fossils";
    Category["Headwear"] = "Headwear";
    Category["Housewares"] = "Housewares";
    Category["Miscellaneous"] = "Miscellaneous";
    Category["Music"] = "Music";
    Category["Other"] = "Other";
    Category["Photos"] = "Photos";
    Category["Posters"] = "Posters";
    Category["Rugs"] = "Rugs";
    Category["Shoes"] = "Shoes";
    Category["Socks"] = "Socks";
    Category["Tools"] = "Tools";
    Category["Tops"] = "Tops";
    Category["Umbrellas"] = "Umbrellas";
    Category["WallMounted"] = "Wall-mounted";
    Category["Wallpapers"] = "Wallpapers";
})(Category);

function makeGiftItem(jsonItem) {
    const {
        name, style1, style2, sourceSheet: category, variants: jsonVariants, style: legacyStyle
    } = jsonItem

    let styles = null
    if(legacyStyle !== undefined){
        styles = [legacyStyle.toLowerCase(), legacyStyle.toLowerCase()]
    }
    else{
        styles = [style1.toLowerCase(), style2.toLowerCase()]
    }

    const variants = new Map()
    for(const jVar of jsonVariants){
        const {
            uniqueEntryId: vId, variation: vName, colors: vColors, storageImage: vImgUrl
        } = jVar
        const variant = new GiftItemVariant(vId, vName, vColors.map(c => c.toLowerCase()), vImgUrl)
        variants.set(vId, variant);
    }

    const defaultVariant = jsonVariants[0]

    return new GiftItem(
        `_${defaultVariant.uniqueEntryId}`,
        name.toLowerCase(),
        defaultVariant.sell,
        variants,
        styles,
        category
    );
}

function makeVillager(jsonVillager){
    const {uniqueEntryId: id, name, styles, colors, iconImage: imageUrl} = jsonVillager
    const colorPrefs = colors.map( (color) => color.toLowerCase() )
    const stylePrefs = styles.map( (style) => style.toLowerCase() )

    return new Villager(id, name, colorPrefs, stylePrefs, imageUrl);
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

export {Category, makeCatalog, makeGiftItem, makeRoster, makeVillager};