import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import { getAllVideos } from '../controllers/videoController.js';
import { expect } from 'chai';
import initModels from '../../src/models/init-models.js';
import sequelize from '../../src/models/connect.js';

const model = initModels(sequelize);

//để tạo 1 bộ test case
// happy case, case fail
describe('getVideos', () => {
  let req, res, findAllSub;

  beforeEach(() => {
    //giả lập request
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    findAllSub = sinon.stub(model.video, 'findAll');
  });
  // khôi phục lại setting sau khi test case
  afterEach(() => {
    sinon.restore();
  });

  it('return 200 and list of video', async () => {
    const videos = [
      {
        video_id: 1,
        video_name: 'Introduction to Coding',
        thumbnail: 'deadpool.jpg',
        description: 'Learn the basics of coding',
        views: 1500,
        source: 'youtube.com',
        user_id: 1,
        type_id: 2,
      },
    ];

    findAllSub.resolves(videos);
    await getAllVideos(req, res);
    //Kiểm tra ré.status được gọi với 200
    expect(res.status.calledWith(200)).to.be.true;
  });
});
