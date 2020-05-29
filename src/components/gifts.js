import React from 'react';
import {Recipient} from 'components/recipients.js'
import {GiftBoxIcon, AltGiftBoxIcon, ItemColorsIcon} from 'components/icon.js';
import './gifts.css'

class GiftLookup extends React.Component {
    render() {
        return (
            <div className="mori-search-input">
                <input
                    type="text"
                    value={this.props.value}
                    placeholder={"Gift to check?"}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

class GiftJudgements extends React.Component {
    render() {
        const judgements = this.props.judgements;
        const vId = this.props.variantId;
        const nullCallback = () => false;

        let judgedContent = <div>No one liked this.</div>;
        if(judgements.get(vId).length > 0){
            judgedContent = judgements.get(vId).map( j => {
                return (
                    j.liked && 
                    <Recipient
                        value={j.who}
                        selected={false}
                        key={'j_'+j.who.id}
                        toggleCallback={nullCallback} />
                )
            });
        }
        return(
            <div className="judgements">
                {judgedContent}
            </div>
        );
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
        const item = this.props.value;
        const recipients = this.props.recipients;
        const returnGiftMsg = (sellPrice) => {
            return (sellPrice >= 2500 && <AltGiftBoxIcon/>)
                || (sellPrice >= 250 && <GiftBoxIcon/>)
                || ''
        };
        if(this.props.showVariants === false){
            return (
                <div className="gift" onClick={this.handleClick}>
                    <div className="alts">
                        <div className="alt-color" key={item.defaultVariant.id}>
                            <img src={item.defaultVariant.imgUrl} alt={item.name} />
                            <div className="icons">
                                {returnGiftMsg(item.sell)}
                            </div>
                        </div>
                    </div>
                    <div className="detail">
                      <div className="name">{item.name}</div>
                      <div className={`quality style-${item.style}`}>{item.style}</div>
                    </div>
                </div>
            );
        }
        else {
            let judgements = new Map();
            const variantIds = Array.from(item.variants.keys());
            for(const vId of variantIds){
                judgements.set(vId, recipients.map( recipient => {
                    const {liked, reason} = recipient.checkGift(item, vId);
                    return {
                        who: recipient,
                        liked: liked,
                        reason: reason
                    };
                }).filter( result => result.liked ));
            }
            return (
                <div className="gift gift-group" onClick={this.handleClick}>
                    <div className="detail">
                      <div><span className="name">{item.name}</span></div>
                      <div className={`quality style-${item.style}`}>{item.style}</div>
                      <div className="icons">
                          {returnGiftMsg(item.sell)}
                      </div>
                    </div>
                    <div className="alts">
                    {
                        variantIds.map( (vId) => {
                            const variant = item.variants.get(vId);
                            const name = variant.name || item.name;
                            return(
                                <div className="alt-color" key={variant.id}>
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
                                    <GiftJudgements
                                        judgements={judgements}
                                        variantId={vId}
                                    />
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            );
        }
    }
}

const itemNameComparator = (query) => {
    return (a, b) => {
        if((a.name.indexOf(query) === 0 && b.name.indexOf(query) === 0) ||
           (a.name.indexOf(query) !== 0 && b.name.indexOf(query) !== 0)) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            // names must be equal
            return 0;
        }
        if (a.name.indexOf(query) === 0) {
             return -1;
        }
        if (b.name.indexOf(query) === 0) {
            return 1;
        }
        // impossible state
        console.log('impossible state reached');
        return 0;
    };
};

class GiftSearchList extends React.Component {
    render() {
        const query = this.props.giftName;
        if(!query) {
            return '';//(<div className="gResults"></div>);
        }
        const catalog = this.props.items;
        let found = catalog.findByNameLike(this.props.giftName, itemNameComparator(query));
        const exact = found.filter(item => {
            return item.name.toLowerCase() == query.toLowerCase();
        });
        if(exact.length > 0)
            found = exact;
        const showVariants = (found.length === 1);

        if(found.length === 0){
            return (
                <div className="gResults">
                    <span className="count">No clothing or bag matches found.</span>
                </div>
            );
        }
        return (
            <div className="gResults">
            {
                found.map( item => {
                    return (
                        <div className="mori-gift" key={item.id}>
                            <GiftSearchResult
                                value={item}
                                showVariants={showVariants}
                                itemSelectCallback={this.props.itemSelectCallback}
                                recipients={this.props.recipients}
                            />
                        </div>
                    );
                })
            }
            </div>
        );
    }
}

export {GiftLookup, GiftSearchList};