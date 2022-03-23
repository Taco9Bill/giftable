import React from 'react';
import { Category, makeCatalog, makeRoster } from 'modules/dataloader.js'
import { Roster, RosterSearchResults, Recipients, RecipientLookup } from 'components/recipients.js'
import { GiftInventory } from 'components/gifts.js'
import './normalize.css'
import './App.css';
import rawVillagers from './ds/villagers.json'
import rawItems from './ds/items.json'


const inclCats = [
    Category.Tops, Category.Bottoms, Category.DressUp, Category.Headwear,
    Category.Socks, Category.Shoes, Category.Accessories, Category.Bags
];
const roster = makeRoster(rawVillagers);
const catalog = makeCatalog(rawItems, inclCats);

class Giftable extends React.Component {
    constructor(props) {
        super(props);
        const selected = JSON.parse(localStorage.getItem('recipients') || null);
        this.state = {
          /*giftName: '',*/
          recipientName: '',
          recipientList: (selected && roster.findByIds(selected)) || []
        };
        // this.onChangeGiftName = this.onChangeGiftName.bind(this);
        this.onChangeRecipientName = this.onChangeRecipientName.bind(this);
        this.toggleRecipientCallback = this.toggleRecipientCallback.bind(this);
        // this.onClickSearchResult = this.onClickSearchResult.bind(this);
    }
    /*
    setGiftName(value){
        this.setState({giftName: value});
    }
    */
    setRecipientName(value){
        this.setState({recipientName: value});
    }
    setRecipientList(value){
        this.setState({recipientList: value});
    }
    onChangeRecipientName(e) {
        if (e.currentTarget) {
            this.setRecipientName(e.currentTarget.value);
        }
    }
    /*
    onChangeGiftName(e) {
        if (e.currentTarget) {
            this.setGiftName(e.currentTarget.value);
        }
    }
    onClickSearchResult(item){
        this.setGiftName(item.name);
    }
    */
    toggleRecipientCallback(recipient){
        let list = this.state.recipientList.slice();
        const pos = list.indexOf(recipient);
        if(pos !== -1){
            list.splice(pos,1);
            localStorage.setItem('recipients', JSON.stringify(list.map(r => r.id)));
            this.setRecipientList(list);
        }
        else{
            list.push(recipient);
            list.sort((a,b) => a.name > b.name);
            localStorage.setItem('recipients', JSON.stringify(list.map(r => r.id)));
            this.setState({
                recipientList: list,
                recipientName: ''
            });
        }
    }
    render() {
        return (
          <div className="mori">
            <div className="residents">
              <div className="mori-search">
                <RecipientLookup 
                    value={this.state.recipientName}
                    onChange={this.onChangeRecipientName}
                />
              </div>
              <Roster>
                <RosterSearchResults query={this.state.recipientName} members={roster} excludes={this.state.recipientList} toggleCallback={this.toggleRecipientCallback}/>
                <Recipients members={this.state.recipientList} toggleCallback={this.toggleRecipientCallback}/>
              </Roster>
            </div>
            <GiftInventory catalog={catalog} recipients={this.state.recipientList} />

          </div>
        );
    }
}

export default Giftable;

/*
              <div className="mori-search">
                <GiftLookup
                    value={this.state.giftName}
                    onChange={this.onChangeGiftName}
                />
              </div>
              <GiftSearchList
                items={catalog}
                giftName={this.state.giftName}
                itemSelectCallback={this.onClickSearchResult}
                recipients={this.state.recipientList}
              />
              <GiftVariantsView item={this.state.giftName} />
 */