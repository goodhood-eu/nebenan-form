import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import clsx from 'clsx';
import { bindTo, invoke } from '../utils';


class Dropzone extends PureComponent {
  constructor(props) {
    super(props);

    bindTo(this,
      'handleDragStart',
      'handleDragEnd',
      'handleGlobalDrop',
      'handleDragEnter',
      'handleDragLeave',
      'handleDragOver',
      'handleDrop',
    );

    this.state = this.getDefaultState();
  }

  componentDidMount() {
    this.activate();
  }

  componentWillUnmount() {
    this.deactivate();
  }

  getDefaultState() {
    return {
      isActive: false,
      isHover: false,
    };
  }

  reset(done) {
    // Counters are needed to handle insane enter/leave calls
    this.startedCounter = 0;
    this.enteredCounter = 0;
    this.setState(this.getDefaultState(), done);
  }

  activate() {
    this.reset();

    document.addEventListener('dragenter', this.handleDragStart);
    document.addEventListener('dragleave', this.handleDragEnd);
    document.addEventListener('drop', this.handleGlobalDrop);
  }

  deactivate() {
    document.removeEventListener('dragenter', this.handleDragStart);
    document.removeEventListener('dragleave', this.handleDragEnd);
    document.removeEventListener('drop', this.handleGlobalDrop);
  }

  handleDragStart(event) {
    this.startedCounter += 1;
    if (this.startedCounter === 1) {
      this.setState({ isActive: true });
      invoke(this.props.onDragStart, event);
    }
  }

  handleDragEnd(event) {
    this.startedCounter -= 1;
    if (this.startedCounter === 0) {
      this.setState({ isActive: false });
      invoke(this.props.onDragEnd, event);
    }
  }

  handleGlobalDrop() {
    this.reset();
  }

  handleDragEnter(event) {
    this.enteredCounter += 1;
    if (this.enteredCounter === 1) {
      this.setState({ isHover: true });
      invoke(this.props.onDragEnter, event);
    }
  }

  handleDragLeave(event) {
    this.enteredCounter -= 1;
    if (this.enteredCounter === 0) {
      this.setState({ isHover: false });
      invoke(this.props.onDragLeave, event);
    }
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    invoke(this.props.onDragOver, event);
  }

  handleDrop(event) {
    event.preventDefault();
    const { files } = event.dataTransfer;
    // Could be dragging DOM nodes around
    if (files.length) invoke(this.props.onSelect, files);
    invoke(this.props.onDrop, event);
  }

  render() {
    const { isActive, isHover } = this.state;
    const { children, labelDrag, labelRelease } = this.props;
    const className = clsx('c-dropzone', this.props.className, {
      'is-active': isActive,
      'is-hover': isHover,
    });
    const cleanProps = omit(this.props,
      'children',
      'onSelect',
      'onDragStart',
      'onDragEnd',
      'labelDrag',
      'labelRelease',
    );

    return (
      <span
        {...cleanProps} className={className}
        onDragOver={this.handleDragOver} onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}
      >
        {children}
        <span className="c-dropzone-overlay">
          <span className="c-dropzone-overlay-text-active">{labelDrag}</span>
          <span className="c-dropzone-overlay-text-hover">{labelRelease}</span>
        </span>
      </span>
    );
  }
}

Dropzone.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,

  className: PropTypes.string,
  labelDrag: PropTypes.node.isRequired,
  labelRelease: PropTypes.node.isRequired,
  children: PropTypes.node,
};


export default Dropzone;
