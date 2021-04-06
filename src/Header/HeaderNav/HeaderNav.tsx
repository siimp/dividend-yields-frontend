import * as React from "react";

const CURRENT_YEAR = (new Date()).getFullYear();
const TABS = ['Future dividends'];

const PAST_YEARS_TO_SHOW = 4;
for(let year = CURRENT_YEAR; year > CURRENT_YEAR - PAST_YEARS_TO_SHOW; year--) {
    TABS.push(year.toString())
}

export interface IHeaderNavProps {
    tabChangedHandler: (tabName: string) => void
}

export interface IHeaderNavState {
    activeTab: string
}

class HeaderNav extends React.PureComponent<IHeaderNavProps, IHeaderNavState> {

    constructor(props: IHeaderNavProps) {
        super(props);
        this.state = {activeTab: TABS[0]}
        this.onTabClick = this.onTabClick.bind(this);
        this.getActiveClass = this.getActiveClass.bind(this);
    }

    public onTabClick(event: any) {
        this.setState({activeTab: event.target.innerHTML});
    }

    public getActiveClass(tab: string): string {
        return tab === this.state.activeTab ? 'is-active has-text-info' : '';
    }

    public componentDidUpdate(prevProps: any, prevState: any) {
        this.props.tabChangedHandler(this.state.activeTab)
    }

    public componentDidMount() {
        this.props.tabChangedHandler(this.state.activeTab)
    }

    public render() {
        return (
            <nav className="tabs is-left is-boxed">
                <div className="container">
                    <ul>
                        {TABS.map((tabName, index) => (<li key={index} className={this.getActiveClass(tabName)}><a onClick={this.onTabClick}>{tabName}</a></li>))}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default HeaderNav;