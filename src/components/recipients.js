import React from 'react';
import { PreferenceHints } from 'components/icon.js';
import withJudgement from 'components/withJudgment.js';
import './recipients.css';

class RecipientLookup extends React.Component {
    render() {
        const {value: query, onChange} = this.props
        return (
            <div className="mori-search-input">
                <input type="text" value={query} placeholder={"Who is this gift for?"} onChange={onChange} />
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
        const {
            value: recipient,
            showHints = false,
            selected = false
        } = this.props;

        return (
            <div className={`vlgr${selected ? ' selected': ''}`}>
              <img src={recipient.iconUrl} alt={recipient.name} onClick={this.handleClick}/>
              <span className="name">{recipient.name}</span>
              { (showHints && <PreferenceHints styles={recipient.stylePrefs} colors={recipient.colorPrefs} />) || null }
              { this.props.children }
            </div>
        );
    }
}

const RecipientWithJudgement = withJudgement(Recipient)

class Recipients extends React.Component {
    render(){
        const {members, showHints = false, toggleCallback} = this.props
        return (
            <div className="vResults">
            { 
              members.map( member => {
                return (
                  <div className="vEntry" key={member.id}>
                      <Recipient value={member} selected={true} showHints={showHints} toggleCallback={toggleCallback} key={member.id}/>
                  </div>
                );
              })
            }
            </div>
        )
    }
}

class RosterSearchResults extends React.Component {
    render() {
        const {query, members: roster, excludes, toggleCallback} = this.props
        if(!query){
            return null
        }
        const exclIds = excludes.map( villager => villager.id )
        const found = roster.findByNameLike(query).filter( villager => {
            return !exclIds.includes(villager.id)
        })
        console.log('search results:', found)
        if(found.length === 0){
            return (
                <div className="vResults">
                    <span>No villager with that name found.</span>
                </div>
            )
        }
        return (
            <div className="vResults">
            {
              found.map( villager => {
                return (
                    <div className="vEntry" key={villager.id}>
                        <Recipient value={villager} selected={false} toggleCallback={toggleCallback} />
                    </div>
                )
              })
            }
            </div>
        )
    }
}

class Roster extends React.Component {
    render() {
        const { children } = this.props
        return (
            <div>
                { children }
            </div>
        )
    }
}

export { Recipient, RecipientWithJudgement, Recipients, Roster, RosterSearchResults, RecipientLookup };