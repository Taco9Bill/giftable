import React from 'react';
import Present from './img/Present.png';
import BlueRibbonPresent from './img/Present2.png';
import BellBag from './img/MoneyBag069.png';
import GiftWrap from './img/WPaperYellow.png'
import './icon.css';

class GiftBoxIcon extends React.Component {
	render(){
		const desc = 'Will receive gift or bells in return';
		return <img src={Present} alt='gift box badge' title={desc} />;
	}
}

class AltGiftBoxIcon extends React.Component {
	render(){
		const desc = 'Will receive gift in return';
		return <img src={BlueRibbonPresent} alt="special gift box badge" title={desc} />;
	}
}

class BellBagIcon extends React.Component {
	render(){
		return <img src={BellBag} alt="bell bag badge" />;
	}
}

class GiftWrapIcon extends React.Component {
	render(){
		const desc = 'Gift can be wrapped';
		return <img src={GiftWrap} alt="gift wrap badge" title={desc} />;
	}
}

class ItemColorsIcon extends React.Component {
	render(){
		const [color1, color2] = this.props.colors;
		const titleAttr = `${color1} / ${color2}`;
		const classes = `colors color1-${color1.replace(/\s+/g, '')} color2-${color2.replace(/\s+/g, '')}`;
		const icon = <div className={classes} title={titleAttr}>&nbsp;</div>;
		return icon;
	}
}

export {BellBagIcon, GiftBoxIcon, ItemColorsIcon, AltGiftBoxIcon, GiftWrapIcon};
