import React from 'react';
import { StyleIcon, ItemColorsIcon } from 'components/icon.js';
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

class MatchedPreferenceHints extends React.Component {

    render(){
        const {attributes} = this.props
        return(
            <ul>
            {
              attributes.map( attr => {
                return (<li key={attr}>{attr}</li>)
              })
            }
            </ul>
        )
    }
}

class PreferenceHints extends React.Component {

    render(){
        const {styles, colors} = this.props
        const [style1, style2] = styles
        return (
            <div>
                <StyleIcon styleName={style1} />
            {
              style1 != style2 && <StyleIcon styleName={style2} /> || null
            }
                <ItemColorsIcon colors={colors} />
            </div>
        )
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
        const {
            value: recipient,
            reason: reasons,
            showHints = false,
            selected = false

        } = this.props;

        return (
            <div className={`vlgr${selected ? ' selected': ''}`}>
              <img src={recipient.iconUrl} alt={recipient.name} onClick={this.handleClick}/>
              <span className="name">{recipient.name}</span>
              { showHints && <PreferenceHints styles={recipient.stylePrefs} colors={recipient.colorPrefs} /> || null}
              { reasons && <MatchedPreferenceHints attributes={reasons} /> || null}
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