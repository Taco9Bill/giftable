class GiftItem {
    constructor(id, name, sellPrice, variants, style, category){
        this._id = id;
        this._name = name;
        this._sellPrice = sellPrice;
        this._variants = variants;
        this._style = style;
        this._category = category;
        const first = variants.keys().next();
        this._defaultVariantId = first.value;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get sell() { return this._sellPrice; }
    get variants() { return this._variants; }
    get styles() { return this._style; }
    get category() { return this._category; }
    get imgUrl() {
        return this.defaultVariant.imgUrl;
    }
    get defaultVariant(){
        return this._variants.get(this._defaultVariantId);
    }
    static sortComparator(a, b) {
        if (a.name < b.name) {
             return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}

class GiftItemVariant {
    constructor(id, name, colors, imgUrl) {
        this._id = id;
        this._name = name;
        this._colors = colors;
        this._imgUrl = imgUrl;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get colors() { return this._colors; }
    get imgUrl() { return this._imgUrl; }
}

class Catalog {
    constructor(items){
        this._items = items;
    }
    get length(){
        return this._items.length;
    }
    findByName(name) {
        let found = null;
        for(const item of this._items){
            const isMatch = item.name.toLowerCase() === name.toLowerCase();
            if (isMatch){
                found = item;
                break;
            }
        }
        return found;
    }
    findByNameLike(name, comparator) {
        const searchName = name.toLowerCase();
        let found = null;
        if(searchName.indexOf(' ') !== -1 || searchName.indexOf('-') !== -1){
            /* Match any substring */
            found = this._items.filter(item => {
                return item.name.toLowerCase().indexOf(searchName) !== -1;
            });
            /* override comparator */
            comparator = GiftItem.sortComparator;
        }
        else {
            /* Match substring in word parts only */
            found = this._items.filter(item => {
                let parts = item.name.toLowerCase().split(/[\s-]+/);
                const isMatch = parts.reduce( (tested, part) => {
                    return tested || part.indexOf(searchName) === 0;
                }, false);
                return isMatch;
            });
        }
        /* custom sort if passed */
        if(comparator !== undefined){
            found.sort(comparator);
        }
        return found;
    }
    findByStyle(villager, limitCats, limit){
        if(limit === undefined){
            limit = 200;
        }
        let results = {};
        for(const item of this._items){
            if(villager.checkGiftStyle(item)){
                if(!limitCats || limitCats.includes(item.category)){
                    results[item.category] = results[item.category] || [];
                    if(results[item.category].length < limit){
                        results[item.category].push(item);
                    }
                }
            }
        }
        return results;
    }
}

class Villager{
    constructor(id, name, colors, styles, iconUrl){
        this._id = id;
        this._name = name;
        this._colors = colors;
        this._styles = styles;
        this._iconUrl = iconUrl
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get colorPrefs() { return this._colors; }
    get stylePrefs() { return this._styles; }
    get iconUrl() { return this._iconUrl; }

    checkGift(item, variantId){
        const styleMatches = this.checkGiftStyle(item)
        const colorMatches = this.checkGiftColors(item, variantId)

        const matches = {
            style: styleMatches,
            color: colorMatches,
            liked: styleMatches.length > 0 || colorMatches.length > 0
        }
        return matches
    }

    checkGiftStyle(item){
        const matches = item.styles.filter( s => { return this.stylePrefs.includes(s) } )
        return [...new Set(matches)]
    }

    checkGiftColors(item, variantId){
        const variant = item.variants.get(variantId)
        const matches = variant.colors.filter( c => { return this.colorPrefs.includes(c) } )
        return [...new Set(matches)]
    }

    static sortComparator(a, b){
        if (a.name < b.name) {
             return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}

class Roster {
    constructor(members){
        this._members = members;
    }
    get length(){
        return this._members.length;
    }
    findByName(name){
        let found = null;
        for(const villager of this._members){
            const isMatch = villager.name.toLowerCase() === name.toLowerCase();
            if (isMatch){
                console.log(villager.name + "==" + name + " : " + isMatch);
                found = villager;
                break;
            }
        }
        return found;
    }
    findByNameLike(name){
        return this._members.filter( villager => {
            return villager.name.toLowerCase().startsWith(name.toLowerCase());
        });
    }
    findByStyle(item, limit){
        if(limit === undefined){
            limit = 200;
        }
        let results = [];
        for(const villager of this._members){
            if(villager.checkGiftStyle(item)){
                results.push(villager);
            }
            if(results.length >= limit){
                break;
            }
        }
        return results;
    }
    findByIds(ids){
        return this._members.filter( villager => ids.includes(villager.id) );
    }
}

export {Catalog, GiftItem, GiftItemVariant, Roster, Villager};