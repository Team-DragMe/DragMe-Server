export const slackMessage = (method: string, originalUrl: string, error: any, uid?: number): string => {
    return `🤪    [ERROR] [${method}] ${originalUrl} ${uid? `uid: ${uid}` : 'req.user 없음'} ${JSON.stringify(error)}`;
}