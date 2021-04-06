import * as React from 'react';
import Moment from 'react-moment';
import { isUndefined } from 'util';
import DividendUtil from '../util/DividendUtil';
import './DividendYield.css';
import DividendYieldRow from './DividendYieldRow/DividendYieldRow';


const API_HOST = 'https://dividend-yields.siimp.ee/api';
// const API_HOST = 'http://localhost:8080';
const API_YEAR = API_HOST + '/dividend-yield?year=';
const API_FUTURE = API_HOST + '/dividend-yield/future';

export interface IDividendYieldProps {
    year?: number
}

export interface IDividendYieldState {
    data: any[]
    detailedInfoModal: IDetailedInfoModal
    loading: boolean
}

export interface IDetailedInfoModal {
    show: boolean,
    dividends: any[],
    infoLink?: string,
    isin?: string
    name?: string
}

class DividendYield extends React.PureComponent<IDividendYieldProps, IDividendYieldState> {

    constructor(props: IDividendYieldProps) {
        super(props);
        this.state = {
            data: [],
            detailedInfoModal: {
                dividends: [],
                show: false,
            },
            loading: true
        }

        this.setDetailedInfoModal = this.setDetailedInfoModal.bind(this);
        this.closeDetailedInfoModal = this.closeDetailedInfoModal.bind(this);
    }

    public render() {
        return (
            <section className="section">
                <div className={"is-hidden-desktop modal " + (this.state.detailedInfoModal.show ? "is-active" : "")}>
                    <div className="modal-background" />
                    <div className="modal-card extra-padding">
                        <header className="modal-card-head">
                            <p className="modal-card-title">{this.state.detailedInfoModal.name}</p>
                        </header>
                        <section className="modal-card-body">
                        
                            {this.state.detailedInfoModal.dividends.map((dividend, index) => (
                            <table key={index} className="table is-bordered">
                            <thead>
                                <tr>
                                <th colSpan={2}>Dividend info</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>Dividend Amount</td>
                                    <td>{DividendUtil.toFixedNumber(dividend.dividendAmount)} € {dividend.capitalDecrease ? '(capital decrease)' : ''}</td>
                                </tr>
                                <tr>
                                    <td>Price at Ex-Dividend</td>
                                    <td>{DividendUtil.toFixedNumber(dividend.stockPriceAtExDividend) + ' €'}</td>
                                </tr>
                                <tr>
                                    <td>Ex-Dividend Date</td>
                                    <td><Moment format="DD.MM.YYYY">{dividend.exDividendDate}</Moment></td>
                                </tr>
                                <tr>
                                    <td>Dividend Cost</td>
                                    <td>{DividendUtil.getDividendCost(dividend)}M €</td>
                                </tr>
                                <tr>
                                    <td>Nasdaq</td>
                                    <td><a href={this.state.detailedInfoModal.infoLink} target="_blank" rel="noopener noreferrer">{this.state.detailedInfoModal.isin}</a></td>
                                </tr>
                            </tbody>
                        </table>
                            ))}
                        </section>
                        <footer className="modal-card-foot" />
                    </div>
                    <button className="modal-close is-large" onClick={this.closeDetailedInfoModal} aria-label="close" />
                </div>

                <div className="container">
                    <div className="columns progress-bar">
                        <div className="column">
                            { this.state.loading ? (<progress className="progress is-small is-info" max="100">10%</progress>) : (<div/>) }
                        </div>
                    </div>
                
                    { this.state.data.length === 0 && !this.state.loading ? (<p className="is-size-5">No dividends found</p>) : null }
                    { this.state.data.length > 0 && !this.state.loading ? 
                        <table className="table is-bordered">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Dividend Yield</th>
                                    <th className="is-hidden-touch">Dividend Amount</th>
                                    <th className="is-hidden-touch">{this.props.year ? 'Price at Ex-Dividend' : 'Stock Price'}</th>
                                    <th className="is-hidden-touch">Ex-Dividend Date</th>
                                    <th className="is-hidden-touch">Dividend Cost</th>
                                    <th className="is-hidden-touch">Nasdaq</th>
                                    <th className="is-hidden-desktop">Detailed info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map(el => (<DividendYieldRow
                                    key={el.ticker + el.exDividendDate}
                                    name={el.name}
                                    totalDividendYield={el.totalDividendYield}
                                    totalYesterdaysDividendYield={el.totalYesterdaysDividendYield}
                                    dividends={el.dividends}
                                    isin={el.isin}
                                    infoLink={'http://www.nasdaqbaltic.com/market/?pg=details&lang=en&instrument=' + el.isin}
                                    detailedInfoModalSetter={this.setDetailedInfoModal} />))}
                            </tbody>
                        </table>
                    : null }
                </div>
            </section>
        );
    }

    public componentDidMount() {
        this.fetchData();
    }

    public componentDidUpdate(prevProps: any, prevState: any) {
        if (this.props.year !== prevProps.year) {
            this.fetchData();
        }
    }

    private fetchData() {
        const promise: Promise<void> = fetch(this.getApiUrl())
            .then(response => response.json())
            .then(jsonData => this.setState({ data: jsonData }))

        setTimeout(() => {
            this.setState({ loading: true });
            promise.finally(() => {
                this.setState({ loading: false });
            })
        }, 200)
    }

    private getApiUrl(): string {
        if (isUndefined(this.props.year)) {
            return API_FUTURE;
        }
        return API_YEAR + this.props.year;
    }

    private setDetailedInfoModal(dividends: any[], infoLink: string, isin: string, name: string) {
        this.setState({detailedInfoModal: {
            "dividends": dividends,
            "infoLink": infoLink,
            "isin": isin,
            "name": name,
            "show": true
        }})
    }

    private closeDetailedInfoModal() {
        this.setState({detailedInfoModal: {
            dividends: [],
            show: false
        }})
    }
}

export default DividendYield;
