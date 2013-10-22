/*
 * Copyright (C) 2010 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.tictactoe;

import io.adrenaline.AdrenalineIo;
import io.adrenaline.ApiResponse;
import io.adrenaline.User;

import java.util.Random;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

import com.example.android.tictactoe.library.GameActivity;
import com.example.android.tictactoe.library.GameView.State;

public class MainActivity extends Activity {
	TextView status;

	class SignUp extends AsyncTask<String, Object, ApiResponse> {

		@Override
		protected ApiResponse doInBackground(String... arg0) {
			ApiResponse response = User.signUp(arg0[0], arg0[1]);
			return response;
		}

		@Override
		protected void onPostExecute(ApiResponse response) {
			findViewById(R.id.button1).setEnabled(true);
			if (!response.ok()) {
				status.setText("could not sign up: " + response.status());
			} else {
				startGame(true);
			}
		}

	}

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		// AdrenalineIo.APP_ID = "c345e04fb947f1fc6e6a549e897f4f6f900c9963";
		// AdrenalineIo.APP_TOKEN = "AfY0sSfW1dGQtSd84PAM4YTzQupV5zXI";
		// AdrenalineIo.BASE_URL = "https://adrenaline-io.appspot.com/";
		// AdrenalineIo.BASE_URL = "http://10.0.2.2:8080/";
		// AdrenalineIo.APP_ID = "4dc240c5198241c20fe629f1373fb0b69b70863c";
		// AdrenalineIo.APP_TOKEN = "TUgeCYxTvR48N94lo9ZQMmoKj5J9-FD7";
		AdrenalineIo.init(this);

		status = (TextView) findViewById(R.id.status_string);
		findViewById(R.id.button1).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				status.setText("Signing up...");
				String username = "android_" + Math.abs(new Random().nextInt());
				String password = "woof";
				v.setEnabled(false);
				new SignUp().execute(username, password);
			}
		});

		/*
		 * findViewById(R.id.start_comp).setOnClickListener( new
		 * OnClickListener() { public void onClick(View v) { startGame(false); }
		 * });
		 */
	}

	private void startGame(boolean startWithHuman) {
		Intent i = new Intent(this, GameActivity.class);
		i.putExtra(GameActivity.EXTRA_START_PLAYER,
				startWithHuman ? State.PLAYER1.getValue() : State.PLAYER2.getValue());
		startActivity(i);
	}
}