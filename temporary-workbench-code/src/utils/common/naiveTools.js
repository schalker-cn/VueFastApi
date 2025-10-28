import { isNullOrUndef } from '@/utils'

export function setupMessage(NMessage) {
  let loadingMessage = null
  class Message {
    /**
     * rule：
     * * only one loading message will be displayed，new message will replace the existing loading message
     * * loading message will not be automatically removed，non-loading message will be removed after 2 seconds
     */

    removeMessage(message = loadingMessage, duration = 2000) {
      setTimeout(() => {
        if (message) {
          message.destroy()
          message = null
        }
      }, duration)
    }

    showMessage(type, content, option = {}) {
      if (loadingMessage && loadingMessage.type === 'loading') {
        // replace current loading message
        loadingMessage.type = type
        loadingMessage.content = content

        if (type !== 'loading') {
          // auto remove non-loading message after duration
          this.removeMessage(loadingMessage, option.duration)
        }
      } else {
        // if no loading message, create a new one
        let message = NMessage[type](content, option)
        if (type === 'loading') {
          loadingMessage = message
        }
      }
    }

    loading(content) {
      this.showMessage('loading', content, { duration: 0 })
    }

    success(content, option = {}) {
      this.showMessage('success', content, option)
    }

    error(content, option = {}) {
      this.showMessage('error', content, option)
    }

    info(content, option = {}) {
      this.showMessage('info', content, option)
    }

    warning(content, option = {}) {
      this.showMessage('warning', content, option)
    }
  }

  return new Message()
}

export function setupDialog(NDialog) {
  NDialog.confirm = function (option = {}) {
    const showIcon = !isNullOrUndef(option.title)
    return NDialog[option.type || 'warning']({
      showIcon,
      positiveText: 'commit',
      negativeText: 'cancel',
      onPositiveClick: option.confirm,
      onNegativeClick: option.cancel,
      onMaskClick: option.cancel,
      ...option,
    })
  }

  return NDialog
}
