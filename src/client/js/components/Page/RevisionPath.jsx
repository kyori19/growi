import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import urljoin from 'url-join';

import LinkedPagePath from '../../models/LinkedPagePath';
import PagePathHierarchicalLink from '../PageList/PagePathHierarchicalLink';

import CopyDropdown from './CopyDropdown';

class RevisionPath extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      isListPage: false,
      isLinkToListPage: true,
    };

    // retrieve xss library from window
    this.xss = window.xss;
  }

  componentWillMount() {
    // whether list page or not
    const isListPage = this.props.pagePath.match(/\/$/);
    this.setState({ isListPage });

    // whether set link to '/'
    const { behaviorType } = this.props;
    const isLinkToListPage = (behaviorType === 'crowi');
    this.setState({ isLinkToListPage });

    this.generateHierarchyData();
  }

  /**
   * 1. split `pagePath` with '/'
   * 2. list hierararchical page paths
   *
   * e.g.
   *  when `pagePath` is '/foo/bar/baz`
   *  return:
   *  [
   *    { pagePath: '/foo',         pageName: 'foo' },
   *    { pagePath: '/foo/bar',     pageName: 'bar' },
   *    { pagePath: '/foo/bar/baz', pageName: 'baz' },
   *  ]
   */
  generateHierarchyData() {
    // generate pages obj
    const splitted = this.props.pagePath.split(/\//);
    splitted.shift(); // omit first element with shift()
    if (splitted[splitted.length - 1] === '') {
      splitted.pop(); // omit last element with unshift()
    }

    const pages = [];
    const pagePaths = [];
    splitted.forEach((pageName) => {
      pagePaths.push(encodeURIComponent(pageName));
      pages.push({
        pagePath: urljoin('/', ...pagePaths),
        pageName: this.xss.process(pageName),
      });
    });

    this.setState({ pages });
  }

  showToolTip() {
    const buttonId = '#copyPagePathDropdown';
    $(buttonId).tooltip('show');
    setTimeout(() => {
      $(buttonId).tooltip('hide');
    }, 1000);
  }

  generateLinkElementToListPage(pagePath, isLinkToListPage, isLastElement) {
    /* eslint-disable no-else-return */
    if (isLinkToListPage) {
      return <a href={`${pagePath}/`} className={(isLastElement && !this.state.isListPage) ? 'last-path' : ''}>/</a>;
    }
    else if (!isLastElement) {
      return <span>/</span>;
    }
    else {
      return <span></span>;
    }
    /* eslint-enable no-else-return */
  }

  // render() {
  //   // define styles
  //   const separatorStyle = {
  //     marginLeft: '0.2em',
  //     marginRight: '0.2em',
  //   };
  //   const buttonStyle = {
  //     marginLeft: '0.5em',
  //     padding: '0 2px',
  //   };

  //   const { isPageInTrash, isPageForbidden } = this.props;
  //   const pageLength = this.state.pages.length;

  //   const rootElement = isPageInTrash
  //     ? (
  //       <>
  //         <span className="path-segment">
  //           <a href="/trash"><i className="icon-trash"></i></a>
  //         </span>
  //         <span className="separator" style={separatorStyle}><a href="/">/</a></span>
  //       </>
  //     )
  //     : (
  //       <>
  //         <span className="path-segment">
  //           <a href="/">
  //             <i className="icon-home"></i>
  //             <span className="separator" style={separatorStyle}>/</span>
  //           </a>
  //         </span>
  //       </>
  //     );

  //   const afterElements = [];
  //   this.state.pages.forEach((page, index) => {
  //     const isLastElement = (index === pageLength - 1);

  //     // add elements for page
  //     afterElements.push(
  //       <span key={page.pagePath} className="path-segment">
  //         <a href={page.pagePath}>{page.pageName}</a>
  //       </span>,
  //     );

  //     // add elements for '/'
  //     afterElements.push(
  //       <span key={`${page.pagePath}/`} className="separator" style={separatorStyle}>
  //         {this.generateLinkElementToListPage(page.pagePath, this.state.isLinkToListPage, isLastElement)}
  //       </span>,
  //     );
  //   });

  //   return (
  //     <span className="d-flex align-items-center flex-wrap">

  //       {rootElement}
  //       {afterElements}

  //       <CopyDropdown t={this.props.t} pagePath={this.props.pagePath} pageId={this.props.pageId} buttonStyle={buttonStyle}></CopyDropdown>

  //       { !isPageInTrash && !isPageForbidden && (
  //         <a href="#edit" className="d-block d-edit-none text-muted btn btn-secondary bg-transparent btn-edit border-0" style={buttonStyle}>
  //           <i className="icon-note" />
  //         </a>
  //       ) }
  //     </span>
  //   );
  // }

  render() {
    const linkedPagePath = new LinkedPagePath(this.props.pagePath);

    return (
      <span className="d-flex align-items-center flex-wrap">
        <PagePathHierarchicalLink linkedPagePath={linkedPagePath} />
      </span>
    );
  }

}

RevisionPath.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  behaviorType: PropTypes.string.isRequired,
  pagePath: PropTypes.string.isRequired,
  pageId: PropTypes.string,
  isPageNotFound: PropTypes.bool,
  isPageForbidden: PropTypes.bool,
  isPageInTrash: PropTypes.bool,
};

RevisionPath.defaultProps = {
  isPageNotFound: false,
  isPageForbidden: false,
  isPageInTrash: false,
};

export default withTranslation()(RevisionPath);
