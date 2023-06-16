const issue = require('./utils/issue');
const getTrending = require('./utils/getTrendings');


// run every day at 00:01 UTC
const run = async (date) => {
    const languages = [
        { name: 'csharp', comment: 'Trending repositories for C#' },
        { name: 'javascript', comment: 'Trending repositories for JavaScript' },
        { name: 'python', comment: 'Trending repositories for Python' }
    ];

    let issueNumber;
    for (const [index, { name, comment }] of languages.entries()) {
        const top10Objs = await getTrending(name);
        console.log('Type of top10Objs:', typeof top10Objs);
        console.log('Content of top10Objs:', top10Objs);    
        issueNumber = await processTrendingRepositories(date, top10Objs, comment, index === 0, issueNumber);
    }

    await issue.lock({
        owner: 'chuckfork',
        repo: 'github-daily',
        issueNumber,
    });
};

const processTrendingRepositories = async (date, top10Objs, comment, isFirstLanguage, issueNumber) => {
    let contents = top10Objs.map((obj, i) => {
        let { repo_link, repo, desc, programmingLanguage, starCount, forkCount, todayStarCount } = obj;

        return `\n${i + 1}. [**${repo.split('/').join(' / ')}**](${repo_link})
        
${desc ? '__' + desc + '__' : ''}

${todayStarCount} | ${starCount} stars | ${forkCount} forks ${programmingLanguage ? ('| `' + programmingLanguage + '`') : ''}\n\n`;
    }).join('');

    console.log(contents);

    if (isFirstLanguage) {
        const res = await issue.open({
            owner: 'chuckfork',
            repo: 'github-daily',
            title: `GitHub Daily Top 10 @${date.toISOString().slice(0, 10)}`,
            body: `\n\n**${comment}**\n\n${contents}`,
        });

        return res.data.number;
    } else {
        await issue.comment({
            owner: 'chuckfork',
            repo: 'github-daily',
            issueNumber: issueNumber,
            body: `\n\n**${comment}**\n\n${contents}`,
        });
    }
};

run(new Date())
    .catch(err => {
        throw err
    });