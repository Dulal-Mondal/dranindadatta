import moment from 'moment';

export const formatDate = (date) => moment(date).format('DD MMM YYYY');
export const formatDateTime = (date) => moment(date).format('DD MMM YYYY, hh:mm A');
export const formatTime = (date) => moment(date).format('hh:mm A');
export const timeAgo = (date) => moment(date).fromNow();
export const isToday = (date) => moment(date).isSame(moment(), 'day');
export const isFuture = (date) => moment(date).isAfter(moment());