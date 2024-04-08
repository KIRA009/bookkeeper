export const dateToString = (date: string | null): string => {
    const d = date ? new Date(date) : null;
    return d
        ? d.toLocaleDateString('en-UK', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
          })
        : '';
};
