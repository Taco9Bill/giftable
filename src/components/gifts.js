import React from 'react';
import {RecipientWithJudgement} from 'components/recipients.js'
import {GiftBoxIcon, AltGiftBoxIcon, ItemColorsIcon, StyleHints} from 'components/icon.js';
import './gifts.css'

class GiftLookup extends React.Component {
    render() {
        const { value, onChange } = this.props
        return (
            <div className="mori-search-input">
                <input
                    type="text"
                    value={value}
                    placeholder={"Gift to check?"}
                    onChange={onChange}
                />
            </div>
        );
    }
}

class GiftJudgements extends React.Component {
    render() {
        return(
            <div className="judgements">
                {this.props.children}
            </div>
        );
    }
}
class GiftSearchResultVariant extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showMatches: false
        }
        this.toggleDisplayMatches = this.toggleDisplayMatches.bind(this)
    }
    setShowMatches(value){
        this.setState({showMatches: value});
    }

    toggleDisplayMatches(){
        this.setShowMatches(!this.state.showMatches)
    }
    render() {
        const {variant, defaultName = 'Default', judgements} = this.props
        const name = variant.name || defaultName;
        return(
            <div className="alt-color">
                <div className="alt-entry">
                    <img src={variant.imgUrl} alt={name} />
                {
                    variant.name &&
                    <span className="name">{variant.name}</span>
                }
                <div className="icons">
                    <ItemColorsIcon colors={variant.colors} />
                </div>
                </div>
                <GiftJudgements>
                {
                    (judgements.length > 0
                    && judgements.map( judgement => {
                        const {who, style, color} = judgement
                        return (
                            <RecipientWithJudgement value={who} reasons={[...style, ...color]} showMatches={this.state.showMatches} toggleCallback={this.toggleDisplayMatches}  key={'j_'+who.id} />
                        )
                    }))
                    || <div>No one liked this.</div>
                }
                </GiftJudgements>
            </div>
        )
    }
}

class GiftSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        if(e.currentTarget){
            this.props.itemSelectCallback(this.props.value);
        }
    }
    render() {
        const {value: item} = this.props;
        const returnGiftMsg = (sellPrice) => {
            return (sellPrice >= 750 && <AltGiftBoxIcon/>)
                || (sellPrice >= 250 && <GiftBoxIcon/>)
                || ''
        };

        return (
            <div className="gift" onClick={this.handleClick}>
                <div className="default-color">
                    <img src={item.defaultVariant.imgUrl} alt={item.name} />
                    <div className="icons">
                        {returnGiftMsg(item.sell)}
                    </div>
                </div>
                <div className="summary">
                    <div className="name">{item.name}</div>
                    <StyleHints values={item.styles} />
                </div>
            </div>
        );

    }
}

/**
 * Generates a comparator function that prioritizes matches at the start of the string
 * @param {String} query user submitted string
 * @returns {Function} comparator function for sorting search results
 */
const itemNameComparator = (query) => {
    return (a, b) => {
        const [posA, posB] = [a.name.indexOf(query), b.name.indexOf(query)]
        if((posA === 0 && posB === 0)) {
            // both item names start with search string
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            // names must be equal
            return 0;
        }
        if (posA === 0) {
             return -1;
        }
        if (posB === 0) {
            return 1;
        }
        if (posA > 0 && posB > 0) {
            if (posA < posB) {
                return -1;
            }
            if (posA > posB) {
                return 1;
            }
            // search string occurs at the same spot in both names
            return 0;
        }
        // impossible state
        console.log('impossible state reached');
        return 0;
    };
};

class GiftSearchList extends React.Component {
    render() {
        const {
            giftName: query, items: catalog, itemSelectCallback, recipients
        } = this.props

        if(!query) {
            return null
        }
        const found = catalog.findByNameLike(query, itemNameComparator(query))
        console.log('gift search results:', found.length)
        if(found.length === 0){
            return (
                <div className="gResults">
                    <span className="count">No clothing or bag matches found.</span>
                </div>
            );
        }
        return (
            <div className="gResults">
                <div className="count">({found.length} results)</div>
                <div className="gift-selection">
                {
                    found.map( item => {
                        return (
                            <GiftSearchResult value={item} itemSelectCallback={itemSelectCallback} recipients={recipients} key={item.id} />
                        );
                    })
                }
                </div>
            </div>
        );
    }
}

class GiftVariantsView extends React.Component {
    render() {
        const {item, recipients} = this.props

        if(item === null){
            return null
        }

        const returnGiftMsg = (sellPrice) => {
            return (sellPrice >= 750 && <AltGiftBoxIcon/>)
                || (sellPrice >= 250 && <GiftBoxIcon/>)
                || ''
        };
        const styleHints = <StyleHints values={item.styles} />

        let judgements = new Map();
        const variantIds = Array.from(item.variants.keys());
        for(const vId of variantIds){
            judgements.set(
                vId,
                recipients.map( recipient => {
                    const matches = recipient.checkGift(item, vId);
                    return {
                        who: recipient,
                        ...matches
                    };
                }).filter( result => result.liked )
            );
        }
        return (
            <div className="gResults">
            <div className="gift gift-group" onClick={this.handleClick}>
                <div className="detail">
                  <div><span className="name">{item.name}</span></div>
                  {styleHints}
                  <div className="icons">
                      {returnGiftMsg(item.sell)}
                  </div>
                </div>
                <div className="alts">
                {
                    variantIds.map( (vId) => {
                        return(
                          <GiftSearchResultVariant variant={item.variants.get(vId)} defaultName={item.name} judgements={judgements.get(vId)} key={vId}/>
                        )
                    })
                }
                </div>
            </div>
            </div>
        );
    }
}

class GiftInventory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            giftNameQuery: '',
            giftItem: null
        }
        this.onChangeGiftName = this.onChangeGiftName.bind(this)
        this.onClickSearchResult = this.onClickSearchResult.bind(this)
    }
    setGiftName(value){
        this.setState({giftNameQuery: value});
    }
    setGiftItem(value){
        this.setState({giftItem: value});
    }
    onChangeGiftName(e) {
        if (e.currentTarget) {
            this.setGiftName(e.currentTarget.value);
            if(this.state.giftItem !== null){
                this.setGiftItem(null)
            }
        }
    }
    onClickSearchResult(item){
        this.setGiftItem(item)
        if(this.state.giftNameQuery !== ''){
            this.setGiftName('')
        }
    }
    render() {
        const { giftNameQuery, giftItem } = this.state
        const { catalog, recipients } = this.props
        return (
            <div className="inventory">
              <div className="mori-search">
                <GiftLookup
                    value={giftNameQuery}
                    onChange={this.onChangeGiftName}
                />
              </div>
              {giftItem === null && <GiftSearchList
                items={catalog}
                giftName={giftNameQuery}
                itemSelectCallback={this.onClickSearchResult}
              /> || null}
              {giftItem !== null &&
              <GiftVariantsView item={giftItem} recipients={recipients} />
              || null }
            </div>
        )
    }
}


export {GiftLookup, GiftSearchList, GiftVariantsView, GiftInventory};