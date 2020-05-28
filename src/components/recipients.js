import React from 'react';
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
        return (
            <div className={`vlgr${this.props.selected ? ' selected': ''}`} onClick={this.handleClick}>
              <img src={recipient.iconUrl} alt={recipient.name}/>
              <span className="name">{recipient.name}</span>
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
                                    toggleCallback={this.props.toggleCallback} />
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