import * as jwt from 'jsonwebtoken';
import { Status } from '../../auth/enums/status.enum';

export class JwtService {
  async generateAccessToken(payload: object) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15min',
    });
    return accessToken;
  }

  async generateRefreshToken(payload: object) {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '31d',
    });
    return refreshToken;
  }

  async verifyToken(
    token: string,
    secret: string = process.env.JWT_SECRET,
  ): Promise<any> {
    return jwt.verify(
      token,
      secret,
      {
        clockTimestamp: new Date().getTime() / 1000,
      },
      (err, user) => {
        if (err || !user)
          return { message: 'Invalid token', status: Status.DENIED };
        return user;
      },
    );
  }

  async getIdFromToken(
    bearer: string,
    secret: string = process.env.JWT_SECRET,
  ) {
    if (!bearer) return { message: 'Not authenticated', status: Status.DENIED };
    bearer = bearer.replace(/Bearer /g, '');

    const payload = await this.verifyToken(bearer, secret);
    if (!payload) return false;
    if (typeof payload !== 'string') return payload.id;
  }
}
