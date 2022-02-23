import React from 'react';
import { StyleIcon } from 'components/icon.js';
import './recipients.css';

class RecipientLookup extends React.Component {
    render() {
        return (
            <div className="mori-search-input">
                <input
                    type="text"
                    value={this.props.value}
                    placeholder={"Who is this gift for?"}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

class Recipient extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        if(e.currentTarget){
            this.props.toggleCallback(this.props.value);
        }
    }
    render() {
        const recipient = this.props.value;
        let style1Hint = null;
        let style2Hint = null;
        let colorHint = null;
        if(this.props.showHints !== undefined && this.props.showHints){
            style1Hint = <StyleIcon styleName={recipient.stylePrefs[0]} />
            style2Hint = <StyleIcon styleName={recipient.stylePrefs[1]} />
            colorHint = <ul><li>{recipient.colorPrefs[0]}</li><li>{recipient.colorPrefs[1]}</li></ul>
        }


        let reason = null;
        if(this.props.reason){
            reason = <div>{this.props.reason}</div>
        }
        return (
            <div className={`vlgr${this.props.selected ? ' selected': ''}`}>
              <img src={recipient.iconUrl} alt={recipient.name} onClick={this.handleClick}/>
              <span className="name">{recipient.name}</span>
              {style1Hint}
              {style2Hint}
              {colorHint}
            </div>
        );
    }
}

class RecipientList extends React.Component {
    render() {
        const name = this.props.recipientName;
        const selectedList = this.props.selected;
        if(!name) {
            return (
                <div className="vResults">
                { 
                    selectedList.map( v => {
                        return (
                            <div className="vEntry" key={v.id}>
                                <Recipient
                                    value={v}
                                    selected={true}
                                    toggleCallback={this.props.toggleCallback}
                                    showHints={true} />
                            </div>
                        );
                    })
                }
                </div>
            );
        }
        const found = this.props.members.findByNameLike(this.props.recipientName);
        if(!found){
            return (<span>No villager with that name found.</span>);
        }

        return (
            <div className="vResults">
            {
                found.filter( v => {
                    return !selectedList.includes(v);
                }).map( v => {
                    return (
                        <div className="vEntry" key={v.id}>
                            <Recipient
                                value={v}
                                selected={false}
                                key={v.id}
                                toggleCallback={this.props.toggleCallback} />
                        </div>
                    );
                })
            }{ 
                selectedList.map( v => {
                    return (
                        <div className="vEntry" key={v.id}>
                            <Recipient
                                value={v}
                                selected={true}
                                key={v.id}
                                toggleCallback={this.props.toggleCallback} />
                        </div>
                    );
                })
            }
            </div>
        );
    }
}

export { Recipient, RecipientList, RecipientLookup };